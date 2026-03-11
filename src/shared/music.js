// ============================================
// CIMEGA SMART OFFICE - shared/music.js
// Simpan ke: src/shared/music.js
//
// Cara kerja:
// - State (lagu ke-berapa, muted/tidak) disimpan
//   di main process via IPC
// - Setiap halaman yang dimuat akan sync state
//   dan melanjutkan dari lagu yang sama
// - "Stop" = mute saja, audio tetap jalan
// ============================================

const CimegaMusic = (() => {

  let audio      = null;
  let state      = { index: 0, muted: false, files: [], total: 7 };
  let basePath   = '../../../assets_music/';
  let initialized = false;

  // ── Nama pendek tanpa "Kang Prabu - " ──
  function shortTitle(filename) {
    return filename.replace('Kang Prabu - ', '').replace('.mp3', '');
  }

  // ── Update semua elemen UI ──
  function updateUI() {
    const title   = document.getElementById('musicTitle');
    const info    = document.getElementById('musicTrackInfo');
    const btn     = document.getElementById('musicMuteBtn');
    const bars    = document.getElementById('musicBars');

    if (title) title.textContent  = shortTitle(state.files[state.index] || '');
    if (info)  info.textContent   = `${state.index + 1} / ${state.total}`;
    if (btn)   btn.textContent    = state.muted ? '🔇' : '🔊';
    if (bars) {
      state.muted
        ? bars.classList.add('paused')
        : bars.classList.remove('paused');
    }
  }

  // ── Load & mainkan lagu ──
  function loadAndPlay(index) {
    if (!audio || !state.files.length) return;
    audio.src    = basePath + state.files[index];
    audio.volume = state.muted ? 0 : 0.4;
    audio.play().catch(() => {});
    updateUI();
  }

  // ── Init: panggil 1x saat halaman dimuat ──
  async function init(path) {
    if (initialized) return;
    initialized = true;
    if (path) basePath = path;

    audio = new Audio();
    audio.volume = 0.4;

    // Ambil state dari main process
    state = await window.cimegaAPI.musicGetState();

    // Load lagu sesuai state
    loadAndPlay(state.index);

    // Saat lagu selesai → otomatis next
    audio.addEventListener('ended', async () => {
      const result = await window.cimegaAPI.musicNext();
      state.index = result.index;
      loadAndPlay(state.index);
    });

    // Auto play saat user pertama kali klik/tekan tombol
    const tryPlay = () => {
      audio.play().catch(() => {});
      updateUI();
    };
    document.addEventListener('click',  tryPlay, { once: true });
    document.addEventListener('keydown', tryPlay, { once: true });
    tryPlay();
  }

  // ── Toggle mute (bukan stop, audio tetap jalan) ──
  async function toggleMute() {
    state.muted = !state.muted;
    if (audio) audio.volume = state.muted ? 0 : 0.4;
    await window.cimegaAPI.musicSetState({ muted: state.muted });
    updateUI();
  }

  // ── Next lagu ──
  async function next() {
    const result = await window.cimegaAPI.musicNext();
    state.index = result.index;
    loadAndPlay(state.index);
    await window.cimegaAPI.musicSetState({ index: state.index });
  }

  // ── Prev lagu ──
  async function prev() {
    const result = await window.cimegaAPI.musicPrev();
    state.index = result.index;
    loadAndPlay(state.index);
    await window.cimegaAPI.musicSetState({ index: state.index });
  }

  return { init, toggleMute, next, prev };
})();
