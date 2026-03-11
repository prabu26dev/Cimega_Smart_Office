const CimegaMusic = (() => {

  let audio       = null;
  let state       = { index: 0, muted: false, files: [], total: 7, currentTime: 0 };
  let basePath    = '../../../assets_music/';
  let initialized = false;

  // ── UI RENDERER ──
  function shortTitle(filename) {
    if (!filename) return 'Memuat...';
    return filename.replace('Kang Prabu - ', '').replace('.mp3', '');
  }

  function updateUI() {
    const title   = document.getElementById('musicTitle');
    const info    = document.getElementById('musicTrackInfo');
    const btn     = document.getElementById('musicMuteBtn');
    const bars    = document.getElementById('musicBars');

    if (title) title.textContent  = shortTitle(state.files[state.index] || '');
    if (info)  info.textContent   = `${state.index + 1} / ${state.total}`;
    if (btn)   btn.textContent    = state.muted ? '🔇' : '🔊';
    if (bars) {
      state.muted ? bars.classList.add('paused') : bars.classList.remove('paused');
    }
  }

  // ── CORE AUDIO ENGINE ──
  function loadAndPlay(index, startTime = 0) {
    if (!audio || !state.files.length) return;
    
    audio.src    = basePath + state.files[index];
    audio.volume = state.muted ? 0 : 0.4;

    if (startTime > 0) {
      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = startTime;
      }, { once: true });
    }

    audio.play().catch(() => {});
    updateUI();
  }

  // ── INITIALIZATION ──
  async function init(path) {
    if (initialized) return;
    initialized = true;
    if (path) basePath = path;

    audio = new Audio();
    audio.volume = 0.4;

    state = await window.cimegaAPI.musicGetState();
    loadAndPlay(state.index, state.currentTime);

    setInterval(() => {
      if (audio && !audio.paused) {
        window.cimegaAPI.musicUpdateTime(audio.currentTime);
      }
    }, 100);

    audio.addEventListener('ended', async () => {
      const result = await window.cimegaAPI.musicNext();
      state.index = result.index;
      loadAndPlay(state.index, 0);
    });

    const tryPlay = () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        updateUI();
      }
    };
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('keydown', tryPlay, { once: true });
  }

  // ── CONTROLS ──
  async function toggleMute() {
    state.muted = !state.muted;
    if (audio) audio.volume = state.muted ? 0 : 0.4;
    await window.cimegaAPI.musicSetState({ muted: state.muted });
    updateUI();
  }

  async function next() {
    const result = await window.cimegaAPI.musicNext();
    state.index = result.index;
    loadAndPlay(state.index, 0);
    await window.cimegaAPI.musicSetState({ index: state.index, currentTime: 0 });
  }

  async function prev() {
    const result = await window.cimegaAPI.musicPrev();
    state.index = result.index;
    loadAndPlay(state.index, 0);
    await window.cimegaAPI.musicSetState({ index: state.index, currentTime: 0 });
  }

  return { init, toggleMute, next, prev };
})();