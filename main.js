// ============================================
// CIMEGA SMART OFFICE - main.js
// Versi lengkap dengan auto-updater
// ============================================
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path  = require('path');
const fs    = require('fs');
const https = require('https');
const url   = require('url');
const admin = require('firebase-admin');
const { seedInitialTemplates } = require('./src/services/seeder_service');

// ── Init Firebase Admin ──────────────────────
let firebaseAdminReady = false;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'cimega-smart-office.appspot.com' // Sesuaikan dengan Bucket Anda
  });
  firebaseAdminReady = true;
  console.log('✅ Firebase Admin SDK siap');
} catch (err) {
  console.error('Firebase Admin Init Error:', err.message);
}
const db = admin.firestore();

// ── Baca .env ──────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > 0) {
      let key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      val = val.replace(/^["']|["']$/g, ''); // Hapus tanda kutip jika ada
      env[key] = val;
    }
  });
  return env;
}
const envConfig = loadEnv();

// ── Jalankan AI Generator Service (Port 3001) ──────────────
try {
  require('./src/services/ai_generator_service.js');
} catch (err) {
  console.error('Gagal menjalankan AI Service:', err.message);
}

// ── Musik state (Hybrid: Lokal + Firestore) ────────────
let musicFiles = []; // Diisi dari assets_music lokal dulu
const musicState = {
  index:    0,
  muted:    false,
  position: 0,
};

// ── Shuffle Queue (Fisher-Yates) ──────────────────────
// Pastikan semua lagu diputar acak sebelum mengulang
let _shuffleQueue = []; // Antrian index acak

function buildShuffleQueue() {
  // Buat array index [0, 1, 2, ..., n-1]
  const indices = Array.from({ length: musicFiles.length }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  // Pastikan lagu pertama berbeda dengan lagu terakhir yang tadi diputar
  if (indices.length > 1 && indices[0] === musicState.index) {
    const swapIdx = Math.floor(Math.random() * (indices.length - 1)) + 1;
    [indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]];
  }
  _shuffleQueue = indices;
  console.log(`🔀 Shuffle cycle baru: ${musicFiles.length} lagu diacak (infinite loop aktif)`);
}

function getNextShuffleIndex() {
  // Jika queue habis → auto rebuild shuffle baru (infinite loop)
  if (_shuffleQueue.length === 0) buildShuffleQueue();
  return _shuffleQueue.shift();
}

// ── 1. Baca file lokal terlebih dahulu (sinkron, pasti tersedia) ──
function sortMusicFiles(arr) {
  return arr.sort(function(a, b) {
    var tA = (a.title || a.id || '').toLowerCase();
    var tB = (b.title || b.id || '').toLowerCase();
    return tA < tB ? -1 : tA > tB ? 1 : 0;
  });
}

function loadLocalMusicFiles() {
  try {
    const musicDir = path.join(__dirname, 'assets_music');
    const raw = fs.readdirSync(musicDir).filter(f => /\.(mp3|ogg|wav|flac)$/i.test(f));
    const localFiles = raw.map(f => ({
      id:    f,
      title: f.replace(/\.mp3$/i, '').trim(),
      url:   `assets_music/${f}`,
    }));
    if (localFiles.length > 0) {
      // Sort lokal secara alfabetis berdasarkan title
      musicFiles = sortMusicFiles(localFiles);
      console.log(`🎵 Musik Lokal: ${musicFiles.length} file ditemukan di assets_music`);
    }
  } catch (e) {
    console.warn('⚠️ loadLocalMusicFiles:', e.message);
  }
}
loadLocalMusicFiles();

// ── 2. Sync Firestore sebagai suplemen (opsional, tidak blokir startup) ──
function syncMusicFromFirestore() {
  try {
    db.collection('app_music').where('status', '==', 'active').onSnapshot(snap => {
      const cloudFiles = [];
      snap.forEach(doc => {
        const data = doc.data();
        cloudFiles.push({ id: doc.id, title: data.title, url: data.audioUrl });
      });
      if (cloudFiles.length > 0) {
        // Sort cloud musik secara alfabetis — konsisten dengan lokal
        musicFiles = sortMusicFiles(cloudFiles);
        // Reset index ke 0 saat cloud data masuk pertama kali (hindari out-of-bounds)
        if (musicState.index >= musicFiles.length) musicState.index = 0;
        console.log(`☁️ Sync Musik Cloud: ${musicFiles.length} lagu aktif (sorted).`);
      } else {
        // Firestore kosong → tetap pakai lokal
        loadLocalMusicFiles();
        console.log('ℹ️ Cloud music kosong, tetap pakai lokal.');
      }
      broadcastMusicState();
    }, err => {
      console.warn('⚠️ Firestore music stream error:', err.message);
    });
  } catch (e) {
    console.warn('⚠️ syncMusicFromFirestore skip:', e.message);
  }
}
syncMusicFromFirestore();

// ── Update state ───────────────────────────
let updateInfo = null; // simpan info update yang tersedia

let mainWindow;
let bgMusicWindow = null;

function createBgMusicWindow() {
  if (bgMusicWindow) return;
  bgMusicWindow = new BrowserWindow({ 
    show: false,
    webPreferences: {
      webSecurity: false,
      autoplayPolicy: 'no-user-gesture-required' // Fix Chrome blocking autoplay
    }
  });
  bgMusicWindow.loadURL('data:text/html,<html><head><title>BGM_IDLE</title></head><body></body></html>');
  
  bgMusicWindow.on('page-title-updated', (e, title) => {
    if (title.startsWith('BGM_ENDED')) {
      // Ambil lagu berikutnya dari shuffle queue (acak, tidak berulang)
      if (musicFiles.length > 0) musicState.index = getNextShuffleIndex();
      playMusicOnBgWindow();
    }
  });

  bgMusicWindow.webContents.on('did-finish-load', () => {
    console.log('BGM Window loaded, starting playback...');
    playMusicOnBgWindow();
  });
}

function broadcastMusicState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('music-state-changed', {
      index: musicState.index,
      muted: musicState.muted,
      files: musicFiles
    });
  }
}

function playMusicOnBgWindow() {
  if (!bgMusicWindow || musicFiles.length === 0) return;
  
  const music = musicFiles[musicState.index];
  let audioUrl = '';
  
  if (music.url.startsWith('http')) {
    audioUrl = music.url;
  } else {
    // Local assets fallback
    const absPath = path.join(__dirname, music.url);
    audioUrl = url.pathToFileURL(absPath).href;
  }

  bgMusicWindow.webContents.executeJavaScript(`
    if (!window._bgm) {
      window._bgm = new Audio();
      // ✅ Saat lagu selesai → trigger lagu berikutnya (handled by BGM_ENDED)
      window._bgm.onended = () => { document.title = 'BGM_ENDED_' + Date.now(); };
      // ✅ Jika lagu gagal diload (file rusak/missing) → auto skip ke berikutnya
      window._bgm.onerror = () => {
        console.warn('BGM: File gagal dimuat, skip ke lagu berikutnya...');
        setTimeout(() => { document.title = 'BGM_ENDED_' + Date.now(); }, 2000);
      };
    }
    window._bgm.src = "${audioUrl}";
    window._bgm.volume = ${musicState.muted ? 0 : 0.8};
    window._bgm.play().catch(e => {
      console.error('BGM Play Error:', e);
      // Auto-skip jika play() di-reject (infinite loop safeguard)
      setTimeout(() => { document.title = 'BGM_ENDED_' + Date.now(); }, 2000);
    });
  `).catch(e => console.error('BGM Execute Error:', e));
  broadcastMusicState();
}

function toggleMuteBgWindow(mute) {
  musicState.muted = mute;
  if (bgMusicWindow) {
    bgMusicWindow.webContents.executeJavaScript(`if(window._bgm) window._bgm.volume = ${mute ? 0 : 0.8};`);
  }
  broadcastMusicState();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, height: 800, minWidth: 1024, minHeight: 600,
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      sandbox:          false,   // ← WAJIB: agar require() bekerja di preload.js
      webSecurity:      false,   // ← Izinkan akses file lokal
      preload: path.join(__dirname, 'preload.js'),
      devTools:         true,    // Aktifkan untuk debugging
    },
    show: false,
    backgroundColor: '#020b18',
    title: 'Cimega Smart Office',
    icon: path.join(__dirname, 'assets_images', 'Logo SDN Cimega.png'),
  });

  mainWindow.loadFile('src/pages/login/login.html');
  
  // Inisialisasi musik sesegera mungkin
  createBgMusicWindow();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
    // Kirim sinyal sync-complete agar renderer tahu sistem siap
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('sync-complete', { status: 'ok', musicCount: musicFiles.length });
        console.log('✅ sync-complete dikirim ke renderer');
      }
    }, 1500); // Delay 1.5s agar Firestore onSnapshot sempat attach
  });



  // SECURITY: Hapus Menu Bar bawaan (yang berisi menu akses DevTools)
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setMenu(null);

  // SECURITY: Blokir klik kanan (Context Menu) di seluruh aplikasi
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });

  // SECURITY: Jika DevTools tetap berhasil dibuka secara paksa, tutup lagi secara otomatis
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });

  mainWindow.on('closed', () => { 
    mainWindow = null; 
    app.quit(); // Teruskan sinyal penghentian ke seluruh Jendela (termasuk bgMusicWindow) 
  });
}

// ══════════════════════════════════════════
// IPC HANDLERS
// ══════════════════════════════════════════

// Firebase config
ipcMain.handle('get-firebase-config', () => ({
  apiKey:            envConfig.FIREBASE_API_KEY,
  authDomain:        envConfig.FIREBASE_AUTH_DOMAIN,
  projectId:         envConfig.FIREBASE_PROJECT_ID,
  storageBucket:     envConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId:             envConfig.FIREBASE_APP_ID,
  measurementId:     envConfig.FIREBASE_MEASUREMENT_ID,
}));

ipcMain.handle('get-supabase-config', () => ({
  url: envConfig.SUPABASE_URL,
  key: envConfig.SUPABASE_KEY,
}));

ipcMain.handle('get-app-config', () => ({
  appName:    envConfig.APP_NAME    || 'Cimega Smart Office',
  appVersion: envConfig.APP_VERSION || app.getVersion() || '1.0.0',
}));

// Musik
ipcMain.handle('music-init', () => {
  if (!bgMusicWindow) createBgMusicWindow();
  bgMusicWindow.webContents.executeJavaScript('!!window._bgm && !window._bgm.paused')
    .then(isPlaying => {
      if (!isPlaying) {
        // Mulai dari lagu acak (shuffle dari awal)
        if (musicFiles.length > 0) {
          buildShuffleQueue();
          musicState.index = _shuffleQueue.shift();
        }
        playMusicOnBgWindow();
      } else {
        broadcastMusicState();
      }
    }).catch(() => {
      if (musicFiles.length > 0) {
        buildShuffleQueue();
        musicState.index = _shuffleQueue.shift();
      }
      playMusicOnBgWindow();
    });
  return { ...musicState, files: musicFiles, total: musicFiles.length };
});

ipcMain.handle('music-get-state', () => ({
  index:    musicState.index,
  muted:    musicState.muted,
  files:    musicFiles,
  total:    musicFiles.length,
}));

ipcMain.handle('music-toggle-mute', () => {
  toggleMuteBgWindow(!musicState.muted);
  return musicState.muted;
});

ipcMain.handle('music-next', () => {
  // Ambil lagu berikutnya secara acak dari shuffle queue
  if (musicFiles.length > 0) musicState.index = getNextShuffleIndex();
  playMusicOnBgWindow();
  return { index: musicState.index, title: musicFiles[musicState.index] };
});

ipcMain.handle('music-prev', () => {
  musicState.index = (musicState.index - 1 + musicFiles.length) % musicFiles.length;
  playMusicOnBgWindow();
  return { index: musicState.index, title: musicFiles[musicState.index] };
});

// ══════════════════════════════════════════
// AUTO UPDATER via GitHub Releases
// Tidak pakai electron-updater karena butuh
// code signing. Pakai sistem custom yang lebih
// fleksibel dan tidak butuh sertifikat.
// ══════════════════════════════════════════

// Cek versi terbaru dari GitHub Releases API
ipcMain.handle('check-github-update', async (e, { owner, repo }) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/releases/latest`,
      method: 'GET',
      headers: { 'User-Agent': 'Cimega-Smart-Office' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const release = JSON.parse(data);
          // Cari file .exe di assets
          const exeAsset = release.assets?.find(a => a.name.endsWith('.exe'));
          resolve({
            latestVersion: release.tag_name?.replace('v','') || '0.0.0',
            downloadUrl:   exeAsset?.browser_download_url || release.html_url,
            releaseNotes:  release.body || '',
            releaseName:   release.name || release.tag_name || '',
            publishedAt:   release.published_at || '',
          });
        } catch(err) {
          resolve({ error: 'Gagal parse response: ' + err.message });
        }
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(8000, () => { req.destroy(); resolve({ error: 'Timeout' }); });
    req.end();
  });
});

// Download update ke folder temp
ipcMain.handle('download-update', async (e, { url, version }) => {
  return new Promise((resolve) => {
    const tmpDir  = app.getPath('temp');
    const outPath = path.join(tmpDir, `CimegaSmartOffice-Setup-${version}.exe`);

    // Kalau sudah ada, langsung return
    if (fs.existsSync(outPath)) {
      resolve({ success: true, filePath: outPath });
      return;
    }

    const file = fs.createWriteStream(outPath);
    let downloaded = 0;
    let total = 0;

    function doDownload(downloadUrl) {
      const protocol = downloadUrl.startsWith('https') ? https : require('http');
      protocol.get(downloadUrl, (res) => {
        // Handle redirect
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
          doDownload(res.headers.location);
          return;
        }
        total = parseInt(res.headers['content-length'] || '0');
        res.on('data', (chunk) => {
          downloaded += chunk.length;
          file.write(chunk);
          // Kirim progress ke renderer
          if (mainWindow && !mainWindow.isDestroyed()) {
            const pct = total > 0 ? Math.round(downloaded / total * 100) : 0;
            mainWindow.webContents.send('update-download-progress', { pct, downloaded, total });
          }
        });
        res.on('end', () => {
          file.end();
          resolve({ success: true, filePath: outPath });
        });
        res.on('error', (err) => {
          file.destroy();
          resolve({ success: false, error: err.message });
        });
      }).on('error', (err) => {
        file.destroy();
        resolve({ success: false, error: err.message });
      });
    }

    doDownload(url);
  });
});

// Install update (jalankan .exe installer, lalu tutup app)
ipcMain.handle('install-update', async (e, { filePath }) => {
  if (!fs.existsSync(filePath)) {
    return { success: false, error: 'File tidak ditemukan: ' + filePath };
  }
  try {
    const { spawn } = require('child_process');
    // /S = silent install (NSIS)
    spawn(filePath, ['/S'], {
      detached: true,
      stdio:    'ignore',
    }).unref();
    // Tunggu sebentar lalu tutup app
    setTimeout(() => app.quit(), 1500);
    return { success: true };
  } catch(err) {
    return { success: false, error: err.message };
  }
});

// Buka link di browser
ipcMain.handle('open-external', (e, url) => {
  shell.openExternal(url);
});

// ── Daftar musik lokal dari folder assets_music ──────────────
// Mengembalikan array objek {id, title, url} — KONSISTEN dengan musicFiles
ipcMain.handle('get-music-list', () => {
  try {
    const musicDir = path.join(__dirname, 'assets_music');
    if (!fs.existsSync(musicDir)) {
      console.warn('⚠️ Folder assets_music tidak ditemukan:', musicDir);
      return [];
    }
    const raw = fs.readdirSync(musicDir)
      .filter(f => /\.(mp3|ogg|wav|aac|m4a|flac)$/i.test(f));

    // Buat objek per file, lalu sort alfabetis berdasarkan title
    const result = raw
      .map(f => ({
        id:    f,
        title: f.replace(/\.mp3$/i, '').trim(),
        url:   `assets_music/${f}`,
      }))
      .sort(function(a, b) {
        var tA = a.title.toLowerCase();
        var tB = b.title.toLowerCase();
        return tA < tB ? -1 : tA > tB ? 1 : 0;
      });

    console.log(`🎵 get-music-list: ${result.length} file audio ditemukan di assets_music`);
    return result;
  } catch (e) {
    console.warn('⚠️ get-music-list error:', e.message);
    return [];
  }
});



// ══════════════════════════════════════════
// GEMINI AI API (Google — Free Tier)
// API key disimpan di .env → GEMINI_API_KEY
// Gratis: https://aistudio.google.com/apikey
// Model: gemini-2.5-flash (cepat & gratis)
// ══════════════════════════════════════════
ipcMain.handle('gemini-ask', async (e, { messages, system, maxTokens }) => {
  // Muat ulang env secara live (Hot-reload) agar perubahan API Key langsung masuk tanpa restart!
  const freshEnv = loadEnv();
  const apiKey = freshEnv.GEMINI_API_KEY || envConfig.GEMINI_API_KEY;
  if (!apiKey) return { error: 'GEMINI_API_KEY belum diisi di file .env' };

  // Konversi format messages (claude/openai) ke format Gemini
  const systemInstruction = system ||
    'Kamu adalah asisten administrasi sekolah dasar di Indonesia yang ahli dalam Kurikulum Merdeka Belajar dan Kurikulum 2013. Jawab dalam Bahasa Indonesia yang formal dan profesional.';

  // Gemini pakai "contents" bukan "messages"
  // role: "user" | "model" (bukan "assistant")
  const contents = messages.map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens || 2048,
      temperature:     0.7,
    },
  });

  const model = 'gemini-2.5-flash';
  const path  = `/v1beta/models/${model}:generateContent?key=${apiKey}`;

  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path,
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // Cek error dari Gemini
          if (parsed.error) {
            let errorMsg = parsed.error.message || 'Gemini API error';
            if (errorMsg.includes('Quota exceeded') || errorMsg.includes('429')) {
              errorMsg = 'Batas pemakaian harian gratis AI Anda (Quota) atau batas pesan beruntun saat ini telah tercapai.\nHarap tunggu sebentar (sekitar 1 menit) sebelum mencoba AI lagi.';
            }
            resolve({ error: errorMsg });
            return;
          }
          // Ambil teks dari response Gemini
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (!text) {
            // Jika ada finishReason (misal BLOCKED)
            const finishReason = parsed.candidates?.[0]?.finishReason;
            if (finishReason) {
              resolve({ error: `AI menolak menjawab (Alasan: ${finishReason}). Coba pertanyaan lain.` });
            } else {
              resolve({ error: 'Gemini tidak memberikan respons. Pastikan API Key valid dan model tersedia.' });
            }
            return;
          }
          resolve({ success: true, text });
        } catch (err) {
          resolve({ error: 'Parse error: ' + err.message });
        }
      });
    });

    req.on('error', err => resolve({ error: err.message }));
    req.setTimeout(60000, () => { req.destroy(); resolve({ error: 'Timeout — koneksi lambat, coba lagi' }); });
    req.write(body);
    req.end();
  });
});

// ══════════════════════════════════════════
app.whenReady().then(async () => {
  // Jalankan Seeder
  await seedInitialTemplates(db);
  createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });
