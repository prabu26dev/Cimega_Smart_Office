// ============================================
// CIMEGA SMART OFFICE - shared/music.js v3
// Simpan ke: src/shared/music.js
//
// SOLUSI MUSIK TANPA JEDA ANTAR HALAMAN:
// - Posisi lagu disimpan ke main.js via IPC tiap 2 detik
// - Saat halaman baru dimuat, langsung seek ke posisi terakhir
// - Tidak pernah mulai dari awal kecuali lagu berganti
// ============================================

const CimegaMusic = (() => {

  let audio    = null;
  let state    = { index:0, muted:false, files:[], total:7, position:0 };
  let basePath = '../../../assets_music/';
  let _saveInterval = null;

  function shortTitle(f) {
    return (f||'').replace('Kang Prabu - ','').replace('.mp3','') || 'Memuat...';
  }

  function updateUI() {
    const t    = document.getElementById('musicTitle');
    const info = document.getElementById('musicTrackInfo');
    const btn  = document.getElementById('musicMuteBtn');
    const bars = document.getElementById('musicBars');
    if(t)    t.textContent   = shortTitle(state.files[state.index]);
    if(info) info.textContent = `${state.index+1} / ${state.total}`;
    if(btn)  btn.textContent  = state.muted ? '🔇' : '🔊';
    if(bars) state.muted ? bars.classList.add('paused') : bars.classList.remove('paused');
  }

  async function savePosition() {
    if(!audio || audio.paused || !audio.src) return;
    try {
      await window.cimegaAPI.musicSetState({
        index:    state.index,
        muted:    state.muted,
        position: Math.floor(audio.currentTime),
      });
    } catch(e) {}
  }

  function loadTrack(index, seekTo) {
    if(!audio || !state.files.length) return;
    audio.src    = basePath + state.files[index];
    audio.volume = state.muted ? 0 : 1;
    audio.addEventListener('canplay', function handler() {
      audio.removeEventListener('canplay', handler);
      if(seekTo && seekTo > 1) audio.currentTime = seekTo;
      audio.play().catch(()=>{});
      updateUI();
    }, { once: true });
    audio.load();
    updateUI();
  }

  async function init(path) {
    if(path) basePath = path;
    try { state = await window.cimegaAPI.musicGetState(); } catch(e) {}

    if(audio) { audio.pause(); audio.src = ''; }
    audio = new Audio();
    audio.preload = 'auto';
    audio.volume  = state.muted ? 0 : 1;

    audio.addEventListener('ended', async () => {
      const r = await window.cimegaAPI.musicNext();
      state.index    = r.index;
      state.position = 0;
      loadTrack(state.index, 0);
    });

    // Lanjut dari posisi terakhir (tidak mulai dari awal)
    loadTrack(state.index, state.position || 0);

    // Simpan posisi tiap 2 detik
    if(_saveInterval) clearInterval(_saveInterval);
    _saveInterval = setInterval(savePosition, 2000);

    // Pastikan play setelah interaksi user pertama
    const tryPlay = () => { if(audio && audio.paused) audio.play().catch(()=>{}); };
    document.addEventListener('click',   tryPlay, { once:true });
    document.addEventListener('keydown', tryPlay, { once:true });

    updateUI();
  }

  async function toggleMute() {
    state.muted = !state.muted;
    if(audio) audio.volume = state.muted ? 0 : 1;
    await window.cimegaAPI.musicSetState({ muted: state.muted });
    updateUI();
  }

  async function next() {
    await savePosition();
    const r = await window.cimegaAPI.musicNext();
    state.index = r.index; state.position = 0;
    loadTrack(state.index, 0);
  }

  async function prev() {
    await savePosition();
    const r = await window.cimegaAPI.musicPrev();
    state.index = r.index; state.position = 0;
    loadTrack(state.index, 0);
  }

  return { init, toggleMute, next, prev, updateUI };
})();