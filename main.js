// ─────────────────────────────────────────────────────────
//   CIMEGA SMART OFFICE v2.0
//   Platform Administrasi Sekolah — Kurikulum Merdeka
// ─────────────────────────────────────────────────────────
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path  = require('path');
const fs    = require('fs');
const https = require('https');
const url   = require('url');
const admin = require('firebase-admin');
const { seedInitialTemplates } = require('./src/services/seeder_service');

// ── Init Firebase Admin ──────────────────────────────────
let firebaseAdminReady = false;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'cimega-smart-office.appspot.com'
  });
  firebaseAdminReady = true;
} catch (err) {
  console.error('[ERROR] Firebase Admin:', err.message);
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

// ── Jalankan AI Generator Service (Port 3001) ────────────
try {
  require('./src/services/ai_generator_service.js');
} catch (err) {
  console.error('[ERROR] AI Service:', err.message);
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
  if (musicFiles.length === 0) return;
  const indices = Array.from({ length: musicFiles.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  _shuffleQueue = indices;
  // Log dihapus — terlalu verbose saat banyak window membuka musik
}

function getNextShuffleIndex() {
  if (musicFiles.length === 0) return 0;
  // Jika queue habis → auto rebuild shuffle baru (infinite loop)
  if (_shuffleQueue.length === 0) buildShuffleQueue();
  
  // Jika masih kosong setelah rebuild (misal musicFiles kosong), return 0
  if (_shuffleQueue.length === 0) return 0;
  
  const nextIdx = _shuffleQueue.shift();
  // Update global index agar UI sinkron
  musicState.index = nextIdx;
  return nextIdx;
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
    const raw = fs.readdirSync(musicDir).filter(f => /\.(mp3|ogg|wav|flac|m4a|aac)$/i.test(f));
    const localFiles = raw.map(f => ({
      id:    f,
      title: f.replace(/\.(mp3|ogg|wav|flac|m4a|aac)$/i, '').trim(),
      url:   url.pathToFileURL(path.join(__dirname, 'assets_music', f)).href,
    }));
    if (localFiles.length > 0) {
      musicFiles = sortMusicFiles(localFiles);
    }
  } catch (e) {
    console.warn('[WARN] loadLocalMusicFiles:', e.message);
  }
}
loadLocalMusicFiles();

// ── 2. Sync Firestore (debounced, non-blocking) ──────────
let _musicSyncDebounce = null;

function syncMusicFromFirestore() {
  try {
    db.collection('app_music').where('status', '==', 'active').onSnapshot(snap => {
      if (_musicSyncDebounce) clearTimeout(_musicSyncDebounce);
      _musicSyncDebounce = setTimeout(() => {
        const cloudFiles = [];
        snap.forEach(doc => {
          const data = doc.data();
          if (data.audioUrl) {
            cloudFiles.push({ id: doc.id, title: data.title || doc.id, url: data.audioUrl });
          }
        });

        if (cloudFiles.length > 0) {
          const sorted  = sortMusicFiles(cloudFiles);
          const changed = sorted.length !== musicFiles.length
            || (sorted[0] && musicFiles[0] && sorted[0].id !== musicFiles[0].id);
          if (changed) {
            musicFiles = sorted;
            buildShuffleQueue();
            if (musicState.index >= musicFiles.length) musicState.index = 0;
            broadcastMusicState();
          }
        } else {
          if (musicFiles.length === 0) {
            loadLocalMusicFiles();
            buildShuffleQueue();
            broadcastMusicState();
          }
        }
      }, 1500);
    }, err => {
      console.warn('[WARN] Music sync:', err.message);
    });
  } catch (e) {
    console.warn('[WARN] syncMusicFromFirestore:', e.message);
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
      webSecurity:    false,
      autoplayPolicy: 'no-user-gesture-required'
    }
  });
  bgMusicWindow.loadURL('data:text/html,<html><head><title>BGM_IDLE</title></head><body></body></html>');

  bgMusicWindow.on('page-title-updated', (e, title) => {
    if (title.startsWith('BGM_ENDED')) {
      getNextShuffleIndex();
      playMusicOnBgWindow();
    }
  });

  bgMusicWindow.webContents.on('did-finish-load', () => {
    playMusicOnBgWindow(); // mulai putar tanpa log
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
  if (!bgMusicWindow || bgMusicWindow.isDestroyed() || musicFiles.length === 0) return;

  const music    = musicFiles[musicState.index];
  const audioUrl = music.url.startsWith('http') || music.url.startsWith('file://')
    ? music.url
    : url.pathToFileURL(path.join(__dirname, music.url)).href;

  bgMusicWindow.webContents.executeJavaScript(`
    (function() {
      if (!window._bgm) {
        window._bgm = new Audio();
        window._bgm.onended = () => { document.title = 'BGM_ENDED_' + Date.now(); };
        window._bgm.onerror = (e) => {
          console.warn('BGM: File gagal dimuat, skip...', e);
          setTimeout(() => { document.title = 'BGM_ENDED_' + Date.now(); }, 2000);
        };
      }
      window._bgm.pause();
      window._bgm.src = ${JSON.stringify(audioUrl)};
      window._bgm.volume = ${musicState.muted ? 0 : 0.8};
      window._bgm.load();
      window._bgm.play().catch(e => {
        console.error('BGM Play Error:', e.message);
        setTimeout(() => { document.title = 'BGM_ENDED_' + Date.now(); }, 2000);
      });
    })();
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
      nodeIntegration:  false,      // ✅ AMAN: tidak ekspos Node.js API ke renderer
      contextIsolation: true,       // ✅ AMAN: isolasi context preload vs renderer
      sandbox:          false,      // Diperlukan agar require() bekerja di preload.js
      webSecurity:      true,       // ✅ AMAN: aktifkan Same-Origin Policy (sebelumnya false!)
      allowRunningInsecureContent: false, // ✅ Blokir mixed content
      devTools:         false,      // ✅ AMAN: tutup DevTools di production
      preload: path.join(__dirname, 'preload.js'),
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
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('sync-complete', { status: 'ok', musicCount: musicFiles.length });
      }
    }, 1500);
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

  // Guard: jangan rebuild shuffle queue jika sudah ada dan BGM sudah berjalan
  bgMusicWindow.webContents.executeJavaScript('!!window._bgm && !window._bgm.paused')
    .then(isPlaying => {
      if (!isPlaying) {
        // Hanya build shuffle baru jika queue memang kosong
        if (musicFiles.length > 0 && _shuffleQueue.length === 0) {
          buildShuffleQueue();
          musicState.index = _shuffleQueue.shift() || 0;
        }
        playMusicOnBgWindow();
      }
      // Jika sudah main: cukup broadcast state saja — tidak perlu rebuild apapun
      broadcastMusicState();
    }).catch(() => {
      if (musicFiles.length > 0 && _shuffleQueue.length === 0) {
        buildShuffleQueue();
        musicState.index = _shuffleQueue.shift() || 0;
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
  getNextShuffleIndex();
  playMusicOnBgWindow();
  return { index: musicState.index, title: musicFiles[musicState.index]?.title || 'Unknown' };
});

ipcMain.handle('music-prev', () => {
  // Untuk user experience, prev sebaiknya tetap acak jika di mode shuffle, 
  // atau kita ambil dari queue history. Di sini kita buat acak lagi saja agar sesuai request "acak/random".
  getNextShuffleIndex(); 
  playMusicOnBgWindow();
  return { index: musicState.index, title: musicFiles[musicState.index]?.title || 'Unknown' };
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
  // Whitelist: only allow http/https external links
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    shell.openExternal(url);
  }
});

// ── SECURITY: In-Memory Session Key Store ────────────────────
// school_key tidak disimpan di localStorage — hanya di memori Main Process
// Dibersihkan otomatis saat app ditutup.
let _sessionKeyStore = {}; // { webContentsId → schoolSecretKey }

ipcMain.handle('session-set-key', (e, key) => {
  _sessionKeyStore[e.sender.id] = key;
  return { success: true };
});

ipcMain.handle('session-get-key', (e) => {
  return _sessionKeyStore[e.sender.id] || '';
});

ipcMain.handle('session-clear-key', (e) => {
  delete _sessionKeyStore[e.sender.id];
  return { success: true };
});

// ── Simpan file musik ke assets_music LOKAL saja (tanpa Firestore/Supabase) ──
// Dipakai oleh tombol "Upload Musik" di Admin Panel
ipcMain.handle('music-save-local', async (e, { fileName, fileBuffer }) => {
  try {
    const musicDir = path.join(__dirname, 'assets_music');
    if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });

    // Sanitize nama file (hapus karakter berbahaya)
    const safeName = fileName.replace(/[^a-zA-Z0-9._\- ]/g, '_');
    const destPath  = path.join(musicDir, safeName);

    // Tulis buffer ke file
    const buf = Buffer.from(fileBuffer);
    fs.writeFileSync(destPath, buf);

    // Reload daftar musik lokal agar BGM player bisa langsung main
    loadLocalMusicFiles();
    buildShuffleQueue();
    broadcastMusicState();

    console.log(`[Music] Disimpan: "${safeName}" (${Math.round(buf.length/1024)} KB)`);
    return { success: true, fileName: safeName, path: destPath };
  } catch (err) {
    console.error('[ERROR] music-save-local:', err.message);
    return { success: false, error: err.message };
  }
});

// ── Hapus file musik dari assets_music LOKAL saja ──────────────────────────
ipcMain.handle('music-delete-local', async (e, { fileName }) => {
  try {
    const musicDir = path.join(__dirname, 'assets_music');
    const filePath  = path.join(musicDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Music] Dihapus: "${fileName}"`);
    }
    loadLocalMusicFiles();
    buildShuffleQueue();
    broadcastMusicState();
    return { success: true };
  } catch (err) {
    console.error('[ERROR] music-delete-local:', err.message);
    return { success: false, error: err.message };
  }
});

// ── Daftar musik lokal dari folder assets_music ──────────────
ipcMain.handle('get-music-list', () => {
  try {
    const musicDir = path.join(__dirname, 'assets_music');
    if (!fs.existsSync(musicDir)) return [];
    return fs.readdirSync(musicDir)
      .filter(f => /\.(mp3|ogg|wav|aac|m4a|flac)$/i.test(f))
      .map(f => ({
        id:    f,
        title: f.replace(/\.(mp3|ogg|wav|aac|m4a|flac)$/i, '').trim(),
        url:   url.pathToFileURL(path.join(__dirname, 'assets_music', f)).href,
      }))
      .sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1);
  } catch (e) {
    console.warn('[WARN] get-music-list:', e.message);
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

// ── SECURITY: Content Security Policy (CSP) ─────────────────
// Diterapkan ke semua BrowserWindow via web-contents-created
app.on('web-contents-created', (event, contents) => {
  contents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.supabase.co https://firebasestorage.googleapis.com",
            "connect-src 'self' https://*.firebaseio.com https://*.firestore.googleapis.com https://*.googleapis.com https://*.supabase.co wss://*.firebaseio.com http://localhost:3001",
            "media-src 'self' blob: https://*.supabase.co",
            "object-src 'none'",
            "frame-src 'none'",
            "base-uri 'self'"
          ].join('; ')
        ]
      }
    });
  });

  // Blokir navigasi ke URL eksternal dari dalam window
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    // Izinkan hanya file:// dan localhost
    if (parsedUrl.protocol !== 'file:' && parsedUrl.hostname !== 'localhost') {
      console.warn('[SECURITY] Navigasi eksternal diblokir:', navigationUrl);
      event.preventDefault();
    }
  });

  // Blokir window.open() dan popup
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
});

// ══════════════════════════════════════════
app.whenReady().then(async () => {
  await seedInitialTemplates(db);
  createWindow();

  // ── Startup Banner (tampil 1x setelah semua siap) ──────────
  setTimeout(() => {
    const ver  = require('./package.json').version;
    const node = process.versions.node;
    const line = '─'.repeat(52);
    console.log(`\n${line}`);
    console.log(`  CIMEGA SMART OFFICE  v${ver}`);
    console.log(`  Firebase  : ${firebaseAdminReady ? 'Connected' : 'OFFLINE'}`);
    console.log(`  Musik     : ${musicFiles.length} lagu dimuat`);
    console.log(`  Node.js   : v${node}  |  Electron: v${process.versions.electron}`);
    console.log(`${line}\n`);
  }, 2000); // Tunggu semua service selesai init
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });
app.on('before-quit', () => { _sessionKeyStore = {}; });

