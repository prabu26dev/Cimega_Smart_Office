// ============================================
// CIMEGA SMART OFFICE - preload.js
// ============================================
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cimegaAPI', {
  // Firebase
  getFirebaseConfig:  () => ipcRenderer.invoke('get-firebase-config'),
  getAppConfig:       () => ipcRenderer.invoke('get-app-config'),

  // Musik
  musicGetState: ()  => ipcRenderer.invoke('music-get-state'),
  musicSetState: (s) => ipcRenderer.invoke('music-set-state', s),
  musicNext:     ()  => ipcRenderer.invoke('music-next'),
  musicPrev:     ()  => ipcRenderer.invoke('music-prev'),

  // Auto Updater
  checkGithubUpdate:  (opts) => ipcRenderer.invoke('check-github-update', opts),
  downloadUpdate:     (opts) => ipcRenderer.invoke('download-update', opts),
  installUpdate:      (opts) => ipcRenderer.invoke('install-update', opts),
  openExternal:       (url)  => ipcRenderer.invoke('open-external', url),

  // Claude AI
  claudeAsk: (opts) => ipcRenderer.invoke('claude-ask', opts),

  // Listener progress download (dari main ke renderer)
  onDownloadProgress: (cb) => {
    ipcRenderer.on('update-download-progress', (e, data) => cb(data));
  },
  removeDownloadListener: () => {
    ipcRenderer.removeAllListeners('update-download-progress');
  },
});
