// ============================================
// CIMEGA SMART OFFICE - shared/music.js v4.0 (Continuous BGM)
// Simpan ke: src/shared/music.js
//
// FIX v4.0:
// - Audio object sepenuhnya pindah ke `main.js` (Background Window)
// - File ini murni sebagai Controller UI yang listen ke State Changed.
// ============================================

const CimegaMusic = (() => {

  let currentIndex = 0;
  let isMuted      = false;
  let PLAYLIST     = [];
  let _initialized = false;
  let _uiTimer     = null;

  function shortTitle(f) {
    return (f || '').replace('Kang Prabu - ', '').replace('.mp3', '') || '...';
  }

  // ── updateUI — support ID login (mw*) DAN dashboard/admin (music*) ──
  function updateUI() {
    const title = PLAYLIST.length > 0 ? shortTitle(PLAYLIST[currentIndex]) : 'Memuat...';
    const track = PLAYLIST.length > 0 ? ((currentIndex + 1) + ' / ' + PLAYLIST.length) : '0 / 0';
    const icon  = isMuted ? '🔇' : '🔊';

    // Dashboard & Admin
    const t    = document.getElementById('musicTitle');
    const info = document.getElementById('musicTrackInfo');
    const btn  = document.getElementById('musicMuteBtn');
    const bars = document.getElementById('musicBars');
    
    if (t)    t.textContent    = title;
    if (info) info.textContent = track;
    if (btn)  btn.textContent  = icon;
    if (bars) {
      if (isMuted) bars.classList.add('paused');
      else bars.classList.remove('paused');
    }

    // Login (ID berbeda: mwTitle, mwMuteBtn, mwBars)
    const mwT    = document.getElementById('mwTitle');
    const mwBtn  = document.getElementById('mwMuteBtn');
    const mwBars = document.getElementById('mwBars');
    
    if (mwT)    mwT.textContent   = title;
    if (mwBtn)  mwBtn.textContent = icon;
    if (mwBars) {
      if (isMuted) mwBars.classList.add('paused');
      else mwBars.classList.remove('paused');
    }

    // Retry jika elemen belum terbentuk
    if (!t && !mwT) {
      if (_uiTimer) clearTimeout(_uiTimer);
      _uiTimer = setTimeout(updateUI, 300);
    }
  }

  function applyState(state) {
    if (!state) return;
    if (state.files) PLAYLIST = state.files;
    if (typeof state.index !== 'undefined') currentIndex = state.index;
    if (typeof state.muted !== 'undefined') isMuted      = state.muted;
    updateUI();
  }

  async function init() {
    if (_initialized) return;
    _initialized = true;

    // Pasang listener Broadcast dari main.js (jika halaman memilikinya)
    if (window.cimegaAPI && window.cimegaAPI.onMusicStateChanged) {
      window.cimegaAPI.onMusicStateChanged((state) => applyState(state));
    }

    try {
      // Pemicu init ke main process (Memutar lagu jika belum jalan)
      const initialState = await window.cimegaAPI.musicInit();
      applyState(initialState);
    } catch (e) {
      console.error('CimegaMusic init fail:', e);
    }

    // Force sinkron UI tambahan
    updateUI();
    setTimeout(updateUI, 500);
  }

  async function toggleMute() {
    try {
      const newMute = await window.cimegaAPI.musicToggleMute();
      isMuted = newMute;
      updateUI();
    } catch (e) { console.error(e); }
  }

  async function next() {
    try { await window.cimegaAPI.musicNext(); } catch (e) {}
  }

  async function prev() {
    try { await window.cimegaAPI.musicPrev(); } catch (e) {}
  }

  return { init, toggleMute, next, prev, updateUI };
})();
