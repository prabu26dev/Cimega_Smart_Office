// ============================================
// CIMEGA SMART OFFICE - main.js
// Audio dijalankan di main process agar tidak
// pernah terputus saat ganti halaman
// ============================================
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs   = require('fs');

// ── Baca .env ──────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > 0) env[line.slice(0,idx).trim()] = line.slice(idx+1).trim();
  });
  return env;
}
const envConfig = loadEnv();

// ── State musik (hidup di main process) ───
const musicFiles = [
  'Kang Prabu - Himne SDN Cimega.mp3',
  'Kang Prabu - Mars SDN Cimega.mp3',
  'Kang Prabu - Langkah Kecil Cimega.mp3',
  'Kang Prabu - Duhai Pemilik Jiwa.mp3',
  'Kang Prabu - Juara Di Atas Bumi Mulia.mp3',
  'Kang Prabu - Restu Terakhir.mp3',
  'Kang Prabu - Senam Kreasi Cimega.mp3',
];
const musicState = {
  index: 0,
  muted: false,
  currentTime: 0,
};

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, height: 800, minWidth: 1024, minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false, backgroundColor: '#020b18',
    title: 'Cimega Smart Office'
  });
  mainWindow.loadFile('src/pages/login/login.html');
  mainWindow.once('ready-to-show', () => { mainWindow.show(); mainWindow.maximize(); });
  mainWindow.on('closed', () => { mainWindow = null; });
}

// ── IPC: Firebase config ───────────────────
ipcMain.handle('get-firebase-config', () => ({
  apiKey:            envConfig.FIREBASE_API_KEY,
  authDomain:        envConfig.FIREBASE_AUTH_DOMAIN,
  projectId:         envConfig.FIREBASE_PROJECT_ID,
  storageBucket:     envConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId:             envConfig.FIREBASE_APP_ID,
  measurementId:     envConfig.FIREBASE_MEASUREMENT_ID
}));
ipcMain.handle('get-app-config', () => ({
  appName:    envConfig.APP_NAME    || 'Cimega Smart Office',
  appVersion: envConfig.APP_VERSION || '1.0.0'
}));

// ── IPC: Musik ─────────────────────────────
// Renderer minta state musik saat halaman dimuat
ipcMain.handle('music-get-state', () => {
  return {
    index:  musicState.index,
    muted:  musicState.muted,
    currentTime: musicState.currentTime, // <--- Tambahkan ini
    title:  musicFiles[musicState.index],
    total:  musicFiles.length,
    files:  musicFiles,
  };
});

// Renderer kirim perubahan state ke main
ipcMain.handle('music-set-state', (event, newState) => {
  if (typeof newState.index  !== 'undefined') musicState.index  = newState.index;
  if (typeof newState.muted  !== 'undefined') musicState.muted  = newState.muted;
  return musicState;
});

// Renderer minta lagu berikutnya
ipcMain.handle('music-next', () => {
  musicState.index = (musicState.index + 1) % musicFiles.length;
  return { index: musicState.index, title: musicFiles[musicState.index] };
});

// Renderer minta lagu sebelumnya
ipcMain.handle('music-prev', () => {
  musicState.index = (musicState.index - 1 + musicFiles.length) % musicFiles.length;
  return { index: musicState.index, title: musicFiles[musicState.index] };
});

ipcMain.handle('music-update-time', (event, time) => {
  musicState.currentTime = time;
  return { success: true };
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });
