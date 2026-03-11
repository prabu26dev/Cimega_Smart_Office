// ============================================
// CIMEGA SMART OFFICE - preload.js
// ============================================
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cimegaAPI', {
  // ── Firebase Configuration ──
  getFirebaseConfig: () => ipcRenderer.invoke('get-firebase-config'),
  
  // ── App Configuration ──
  getAppConfig:      () => ipcRenderer.invoke('get-app-config'),

  // ── Musik Sync Engine ──
  // Mengambil status terakhir (index, mute, dan detik lagu)
  musicGetState: () => ipcRenderer.invoke('music-get-state'),
  
  // Mengupdate status musik ke Main Process
  musicSetState: (s) => ipcRenderer.invoke('music-set-state', s),
  
  // Navigasi Playlist
  musicNext:     () => ipcRenderer.invoke('music-next'),
  musicPrev:     () => ipcRenderer.invoke('music-prev'),
  
  // Sinkronisasi detik berjalan agar selaras saat pindah halaman
  musicUpdateTime: (t) => ipcRenderer.invoke('music-update-time', t)
});