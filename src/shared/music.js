// ============================================
// CIMEGA SMART OFFICE - shared/music.js v4.1 (Sync Fix)
//
// FIX v4.1:
// - getTitle() menangani input OBJEK {id,title,url} DAN string filename
// - applyState() men-sort PLAYLIST secara alfabetis sebelum dipakai
//   → urutan di widget selalu sama dengan urutan di player (main.js)
// - Index re-mapping: cari item yang sedang main di sorted array
// - Fallback: jika musicInit() gagal, coba getMusicList() langsung
// ============================================

const CimegaMusic = (() => {

  let currentIndex = 0;
  let isMuted      = false;
  let PLAYLIST     = []; // Array of {id, title, url} — SELALU objek
  let _initialized = false;
  let _uiTimer     = null;
  var _currentTitle = ''; // FIX v2.1: judul dari main.js langsung, tanpa bergantung index re-mapping

  // ── Ekstrak judul bersih dari item playlist ─────────────────
  // Menerima: string filename ATAU objek {id, title, url}
  function getTitle(item) {
    if (!item) return '...';
    // Jika objek dengan properti title
    if (typeof item === 'object' && item.title) {
      return String(item.title)
        .replace(/^Kang Prabu\s*-\s*/i, '')
        .replace(/\.mp3$/i, '')
        .trim() || String(item.title);
    }
    // Jika string (filename mentah)
    if (typeof item === 'string') {
      return item
        .replace(/^Kang Prabu\s*-\s*/i, '')
        .replace(/\.mp3$/i, '')
        .trim() || item;
    }
    return '...';
  }

  // ── Normalisasi item ke objek {id, title, url} ──────────────
  function normalizeItem(item) {
    if (item && typeof item === 'object') return item;
    const clean = String(item);
    // Jika sudah absolut (file:// atau http), jangan tambahkan prefix
    const isAbsolute = clean.startsWith('file://') || clean.startsWith('http');
    return {
      id:    clean,
      title: clean.replace(/\.(mp3|ogg|wav|flac|m4a|aac)$/i, '').split('/').pop(),
      url:   isAbsolute ? clean : 'assets_music/' + clean,
    };
  }

  // ── Sort playlist secara alfabetis berdasarkan title ────────
  function sortPlaylist(arr) {
    return arr.slice().sort(function(a, b) {
      var tA = getTitle(a).toLowerCase();
      var tB = getTitle(b).toLowerCase();
      return tA < tB ? -1 : tA > tB ? 1 : 0;
    });
  }

  // ── updateUI — support login (mw*) DAN admin/dashboard (music*) ──
  function updateUI() {
    // FIX v2.1: gunakan _currentTitle dari main.js jika tersedia, fallback ke PLAYLIST[index]
    var item  = (PLAYLIST.length > 0) ? PLAYLIST[currentIndex] : null;
    var title = _currentTitle || (item ? getTitle(item) : 'Memuat...');
    var track = (PLAYLIST.length > 0) ? ((currentIndex + 1) + ' / ' + PLAYLIST.length) : '0 / 0';
    var icon  = isMuted ? '🔇' : '🔊';

    // Admin & Dashboard IDs
    var t    = document.getElementById('musicTitle');
    var info = document.getElementById('musicTrackInfo');
    var btn  = document.getElementById('musicMuteBtn');
    var bars = document.getElementById('musicBars');

    if (t)    t.textContent    = title;
    if (info) info.textContent = track;
    if (btn)  btn.textContent  = icon;
    if (bars) {
      if (isMuted) bars.classList.add('paused');
      else bars.classList.remove('paused');
    }

    // Login IDs (mwTitle, mwMuteBtn, mwBars)
    var mwT    = document.getElementById('mwTitle');
    var mwBtn  = document.getElementById('mwMuteBtn');
    var mwBars = document.getElementById('mwBars');

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

  // ── Terapkan state yang diterima dari main.js ────────────────
  function applyState(state) {
    if (!state) return;

    if (state.files && Array.isArray(state.files) && state.files.length > 0) {
      // Normalisasi semua item ke objek, lalu sort alfabetis
      var normalized = state.files.map(normalizeItem);
      PLAYLIST = sortPlaylist(normalized);
    }

    // FIX v2.1: jika main.js mengirim currentTitle, gunakan langsung (bypass re-mapping)
    if (state.currentTitle) _currentTitle = state.currentTitle;

    // Re-mapping index: cari item yang sedang dimainkan di sorted array
    // (main.js menggunakan index di array TIDAK ter-sort/urutan asli Firestore/fs)
    if (typeof state.index !== 'undefined' && state.files && state.files.length > 0) {
      var playingItem = state.files[state.index];
      if (playingItem) {
        var playingId = typeof playingItem === 'object'
          ? (playingItem.id || playingItem.url || playingItem.title)
          : String(playingItem);

        var sortedIdx = -1;
        for (var i = 0; i < PLAYLIST.length; i++) {
          var p = PLAYLIST[i];
          var pId = typeof p === 'object' ? (p.id || p.url || p.title) : String(p);
          if (pId === playingId) { sortedIdx = i; break; }
        }
        currentIndex = sortedIdx !== -1 ? sortedIdx : 0;
      } else {
        currentIndex = 0;
      }
    }

    if (typeof state.muted !== 'undefined') isMuted = state.muted;
    updateUI();
  }

  // ── Init ─────────────────────────────────────────────────────
  async function init() {
    if (_initialized) return;
    _initialized = true;

    // Pasang listener broadcast 'music-state-changed' dari main.js
    var api = window.cimegaConfig || window.cimegaAPI;
    if (api && api.onMusicStateChanged) {
      api.onMusicStateChanged(function(state) { applyState(state); });
    }

    try {
      // Minta state awal dari main.js (juga memulai playback jika belum)
      var initFn = (window.cimegaAPI && window.cimegaAPI.musicInit)
        || (window.cimegaConfig && window.cimegaConfig.musicInit);
      if (initFn) {
        var initialState = await initFn();
        applyState(initialState);
      }
    } catch (e) {
      console.error('CimegaMusic init fail:', e);
      // Fallback: ambil daftar file lokal langsung jika IPC gagal
      try {
        var getMusicFn = (window.cimegaConfig && window.cimegaConfig.getMusicList)
          || (window.cimegaAPI && window.cimegaAPI.getMusicList);
        if (typeof getMusicFn === 'function') {
          var files = await getMusicFn();
          if (files && files.length > 0) {
            var normalized = files.map(normalizeItem);
            PLAYLIST = sortPlaylist(normalized);
            currentIndex = 0;
          }
        }
      } catch (_) {}
    }

    updateUI();
    setTimeout(updateUI, 800); // Retry setelah DOM stabil
  }

  async function toggleMute() {
    try {
      var api = window.cimegaConfig || window.cimegaAPI;
      var muteFn = api && (api.musicToggleMute);
      if (muteFn) {
        var newMute = await muteFn();
        isMuted = newMute;
        updateUI();
      }
    } catch (e) { console.error('toggleMute:', e); }
  }

  async function next() {
    try {
      var api = window.cimegaConfig || window.cimegaAPI;
      if (api && api.musicNext) await api.musicNext();
    } catch (e) {}
  }

  async function prev() {
    try {
      var api = window.cimegaConfig || window.cimegaAPI;
      if (api && api.musicPrev) await api.musicPrev();
    } catch (e) {}
  }

  // Expose getTitle untuk dipakai komponen lain (admin.html, dll.)
  return { init, toggleMute, next, prev, updateUI, getTitle };
})();
