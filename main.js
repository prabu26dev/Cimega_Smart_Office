// ============================================
// CIMEGA SMART OFFICE - main.js
// Versi lengkap dengan auto-updater
// ============================================
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path  = require('path');
const fs    = require('fs');
const https = require('https');

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

// ── Musik state ────────────────────────────
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
  index:    Math.floor(Math.random() * musicFiles.length),
  muted:    false,
  position: 0,   // posisi detik lagu, agar tidak mulai dari awal saat pindah halaman
};

// ── Update state ───────────────────────────
let updateInfo = null; // simpan info update yang tersedia

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, height: 800, minWidth: 1024, minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    backgroundColor: '#020b18',
    title: 'Cimega Smart Office',
    icon: path.join(__dirname, 'assets_images', 'Logo SDN Cimega.png'),
  });

  mainWindow.loadFile('src/pages/login/login.html');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });
  mainWindow.on('closed', () => { mainWindow = null; });
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

ipcMain.handle('get-app-config', () => ({
  appName:    envConfig.APP_NAME    || 'Cimega Smart Office',
  appVersion: envConfig.APP_VERSION || app.getVersion() || '1.0.0',
}));

// Musik
ipcMain.handle('music-get-state', () => ({
  index:    musicState.index,
  muted:    musicState.muted,
  position: musicState.position || 0,
  files:    musicFiles,
  total:    musicFiles.length,
}));
ipcMain.handle('music-set-state', (e, s) => {
  if (typeof s.index    !== 'undefined') musicState.index    = s.index;
  if (typeof s.muted    !== 'undefined') musicState.muted    = s.muted;
  if (typeof s.position !== 'undefined') musicState.position = s.position;
  return musicState;
});
ipcMain.handle('music-next', () => {
  musicState.index = (musicState.index + 1) % musicFiles.length;
  return { index: musicState.index, title: musicFiles[musicState.index] };
});
ipcMain.handle('music-prev', () => {
  musicState.index = (musicState.index - 1 + musicFiles.length) % musicFiles.length;
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


// ══════════════════════════════════════════
// GEMINI AI API (Google — Free Tier)
// API key disimpan di .env → GEMINI_API_KEY
// Gratis: https://aistudio.google.com/apikey
// Model: gemini-2.0-flash (cepat & gratis)
// ══════════════════════════════════════════
ipcMain.handle('claude-ask', async (e, { messages, system, maxTokens }) => {
  const apiKey = envConfig.GEMINI_API_KEY;
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

  const model = 'gemini-2.0-flash';
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
            resolve({ error: parsed.error.message || 'Gemini API error' });
            return;
          }
          // Ambil teks dari response Gemini
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (!text) {
            resolve({ error: 'Gemini tidak memberikan respons. Coba lagi.' });
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
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });
