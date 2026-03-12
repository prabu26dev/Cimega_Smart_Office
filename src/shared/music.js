// ============================================
// CIMEGA SMART OFFICE - shared/music.js v3.3
// Simpan ke: src/shared/music.js
//
// FIX v3.3:
// - updateUI() dipanggil saat event 'play' audio
//   → menjamin title update SETELAH musik benar jalan
// - setTimeout fallback 500ms jika event lambat
// - Tidak bergantung pada urutan DOM render
// ============================================

const CimegaMusic = (() => {

  const PLAYLIST = [
    'Kang Prabu - Himne SDN Cimega.mp3',
    'Kang Prabu - Mars SDN Cimega.mp3',
    'Kang Prabu - Langkah Kecil Cimega.mp3',
    'Kang Prabu - Duhai Pemilik Jiwa.mp3',
    'Kang Prabu - Juara Di Atas Bumi Mulia.mp3',
    'Kang Prabu - Restu Terakhir.mp3',
    'Kang Prabu - Senam Kreasi Cimega.mp3',
  ];

  let audio         = null;
  let basePath      = '../../../assets_music/';
  let currentIndex  = 0;
  let isMuted       = false;
  let lastPosition  = 0;
  let _saveInterval = null;
  let _uiTimer      = null;
  let _initialized  = false;

  function shortTitle(f) {
    return (f || '').replace('Kang Prabu - ', '').replace('.mp3', '') || '...';
  }

  // ── Update UI — dengan retry jika elemen belum ada ──
  function updateUI() {
    const t    = document.getElementById('musicTitle');
    const info = document.getElementById('musicTrackInfo');
    const btn  = document.getElementById('musicMuteBtn');
    const bars = document.getElementById('musicBars');

    if (t)    t.textContent    = shortTitle(PLAYLIST[currentIndex]);
    if (info) info.textContent = `${currentIndex + 1} / ${PLAYLIST.length}`;
    if (btn)  btn.textContent  = isMuted ? '🔇' : '🔊';
    if (bars) isMuted ? bars.classList.add('paused') : bars.classList.remove('paused');

    // Jika elemen belum ada, retry setelah 300ms
    if (!t || !info) {
      if (_uiTimer) clearTimeout(_uiTimer);
      _uiTimer = setTimeout(updateUI, 300);
    }
  }

  async function savePosition() {
    if (!audio || audio.paused || !audio.src) return;
    try {
      await window.cimegaAPI.musicSetState({
        index:    currentIndex,
        muted:    isMuted,
        position: Math.floor(audio.currentTime),
      });
    } catch (e) {}
  }

  function loadTrack(index, seekTo) {
    if (!audio) return;
    currentIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;

    // Pasang listener SEBELUM src & load (fix race condition)
    audio.oncanplay = () => {
      audio.oncanplay = null;
      if (seekTo && seekTo > 2) {
        try { audio.currentTime = seekTo; } catch(e) {}
      }
      audio.play().catch(() => {});
    };

    audio.src    = basePath + PLAYLIST[currentIndex];
    audio.volume = isMuted ? 0 : 0.8;
    audio.load();

    // Update UI langsung (judul, track info)
    updateUI();
  }

  async function init(path) {
    if (_initialized) return;
    _initialized = true;
    if (path) basePath = path;

    try {
      const saved = await window.cimegaAPI.musicGetState();
      if (saved) {
        currentIndex = (saved.index >= 0 && saved.index < PLAYLIST.length)
          ? saved.index : 0;
        isMuted      = saved.muted    || false;
        lastPosition = saved.position || 0;
      }
    } catch (e) {
      currentIndex = 0; isMuted = false; lastPosition = 0;
    }

    if (audio) { audio.pause(); audio.oncanplay = null; audio.src = ''; }
    audio         = new Audio();
    audio.preload = 'auto';
    audio.volume  = isMuted ? 0 : 0.8;

    // ★ FIX: event 'play' dipanggil tepat saat musik mulai
    //   → updateUI() pasti jalan setelah audio aktif
    audio.addEventListener('play', () => {
      updateUI();
    });

    // Auto next saat lagu selesai
    audio.addEventListener('ended', () => {
      loadTrack(currentIndex + 1, 0);
    });

    // Mulai dari posisi terakhir
    loadTrack(currentIndex, lastPosition);

    // Simpan posisi tiap 2 detik
    if (_saveInterval) clearInterval(_saveInterval);
    _saveInterval = setInterval(savePosition, 2000);

    // Update UI langsung + fallback 500ms (jika DOM belum siap)
    updateUI();
    setTimeout(updateUI, 500);
  }

  async function toggleMute() {
    isMuted = !isMuted;
    if (audio) audio.volume = isMuted ? 0 : 0.8;
    try { await window.cimegaAPI.musicSetState({ muted: isMuted }); } catch (e) {}
    updateUI();
  }

  async function next() {
    await savePosition();
    loadTrack(currentIndex + 1, 0);
    try { await window.cimegaAPI.musicSetState({ index: currentIndex, position: 0 }); } catch (e) {}
  }

  async function prev() {
    await savePosition();
    loadTrack(currentIndex - 1, 0);
    try { await window.cimegaAPI.musicSetState({ index: currentIndex, position: 0 }); } catch (e) {}
  }

  return { init, toggleMute, next, prev, updateUI };
})();
