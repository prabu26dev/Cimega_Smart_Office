// ============================================
// CIMEGA SMART OFFICE - main.js
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
  // Memilih index acak setiap kali aplikasi dijalankan
  index: Math.floor(Math.random() * musicFiles.length),
  muted: false,
  currentTime: 0,
};

// ── Window Management ──────────────────────
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Cimega Smart Office",
    icon: path.join(__dirname, 'assets/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#020b18'
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('src/pages/login/login.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── IPC: Firebase & Config ─────────────────
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

// ── IPC: Musik (SYNC ENGINE) ───────────────

// Renderer minta state musik saat halaman dimuat
ipcMain.handle('music-get-state', () => {
  return {
    index:       musicState.index,
    muted:       musicState.muted,
    currentTime: musicState.currentTime,
    title:       musicFiles[musicState.index],
    total:       musicFiles.length,
    files:       musicFiles,
  };
});

// Sinkronisasi detik lagu secara real-time
ipcMain.handle('music-update-time', (event, time) => {
  musicState.currentTime = time;
  return { success: true };
});

// Renderer kirim perubahan state ke main
ipcMain.handle('music-set-state', (event, newState) => {
  if (typeof newState.index !== 'undefined') {
    musicState.index = newState.index;
    musicState.currentTime = 0; 
  }
  if (typeof newState.muted !== 'undefined') {
    musicState.muted = newState.muted;
  }
  return musicState;
});

// Renderer minta lagu berikutnya
ipcMain.handle('music-next', () => {
  musicState.index = (musicState.index + 1) % musicFiles.length;
  musicState.currentTime = 0;
  return { index: musicState.index, title: musicFiles[musicState.index] };
});

// Renderer minta lagu sebelumnya
ipcMain.handle('music-prev', () => {
  musicState.index = (musicState.index - 1 + musicFiles.length) % musicFiles.length;
  musicState.currentTime = 0;
  return { index: musicState.index, title: musicFiles[musicState.index] };
});