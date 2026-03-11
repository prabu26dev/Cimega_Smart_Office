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

  // ── CORE AUDIO ENGINE (NO-DELAY MODE) ──
  function loadAndPlay(index, startTime = 0) {
    if (!audio || !state.files.length) return;
    
    // Gunakan Audio Object baru setiap ganti lagu agar buffer bersih
    audio.src = basePath + state.files[index];
    audio.preload = 'auto'; 
    audio.volume = 0; // Mulai dari senyap untuk menghindari suara 'pop'

    // KUNCI: Menghilangkan jeda 0.2 detik dengan kompensasi waktu muat
    const playHandler = () => {
      // Kita tambahkan offset 0.25 detik untuk menutupi waktu transisi antar halaman
      if (startTime > 0) {
        audio.currentTime = startTime + 0.25;
      }
      
      audio.play().then(() => {
        if (!state.muted) {
          // Fade-in sangat cepat untuk menyamarkan sambungan
          let v = 0;
          let fi = setInterval(() => {
            if (v < 0.4) { v += 0.05; audio.volume = v; }
            else { audio.volume = 0.4; clearInterval(fi); }
          }, 5);
        }
      }).catch(() => {});
    };

    audio.addEventListener('canplaythrough', playHandler, { once: true });
    updateUI();
  }

  // ── INITIALIZATION ──
  async function init(path) {
    if (initialized) return;
    initialized = true;
    if (path) basePath = path;

    audio = new Audio();
    state = await window.cimegaAPI.musicGetState();

    // Langsung eksekusi pemutaran
    loadAndPlay(state.index, state.currentTime);

    // Sinkronisasi sangat rapat (16ms = setara refresh rate layar)
    // Agar Main Process selalu punya data waktu yang super akurat
    setInterval(() => {
      if (audio && !audio.paused) {
        window.cimegaAPI.musicUpdateTime(audio.currentTime);
      }
    }, 16);

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