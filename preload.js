// ============================================
// CIMEGA SMART OFFICE - preload.js
// ============================================
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cimegaAPI', {
  // Firebase
  getFirebaseConfig: () => ipcRenderer.invoke('get-firebase-config'),
  getAppConfig:      () => ipcRenderer.invoke('get-app-config'),

  // Musik - state disimpan di main process, tidak pernah hilang saat ganti halaman
  musicGetState: () => ipcRenderer.invoke('music-get-state'),
  musicSetState: (s) => ipcRenderer.invoke('music-set-state', s),
  musicNext:     () => ipcRenderer.invoke('music-next'),
  musicPrev:     () => ipcRenderer.invoke('music-prev'),
});

contextBridge.exposeInMainWorld('cimegaAPI', {
  // ... (fungsi lain tetap)
  musicPrev:     () => ipcRenderer.invoke('music-prev'),
  musicUpdateTime: (t) => ipcRenderer.invoke('music-update-time', t), //
});