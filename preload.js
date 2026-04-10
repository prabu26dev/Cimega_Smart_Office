// ============================================
// CIMEGA SMART OFFICE - preload.js
// ============================================
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cimegaAPI', {
  // Firebase
  getFirebaseConfig:  () => ipcRenderer.invoke('get-firebase-config'),
  getAppConfig:       () => ipcRenderer.invoke('get-app-config'),

  // Musik
  musicInit:       () => ipcRenderer.invoke('music-init'),
  musicGetState:   () => ipcRenderer.invoke('music-get-state'),
  musicToggleMute: () => ipcRenderer.invoke('music-toggle-mute'),
  musicNext:       () => ipcRenderer.invoke('music-next'),
  musicPrev:       () => ipcRenderer.invoke('music-prev'),
  onMusicStateChanged: (cb) => {
    ipcRenderer.on('music-state-changed', (e, data) => cb(data));
  },
  removeMusicStateListener: () => {
    ipcRenderer.removeAllListeners('music-state-changed');
  },

  // Auto Updater
  checkGithubUpdate:  (opts) => ipcRenderer.invoke('check-github-update', opts),
  downloadUpdate:     (opts) => ipcRenderer.invoke('download-update', opts),
  installUpdate:      (opts) => ipcRenderer.invoke('install-update', opts),
  openExternal:       (url)  => ipcRenderer.invoke('open-external', url),

  // Gemini AI
  geminiAsk: (opts) => ipcRenderer.invoke('gemini-ask', opts),

  // Listener progress download (dari main ke renderer)
  onDownloadProgress: (cb) => {
    ipcRenderer.on('update-download-progress', (e, data) => cb(data));
  },
  removeDownloadListener: () => {
    ipcRenderer.removeAllListeners('update-download-progress');
  },
});
