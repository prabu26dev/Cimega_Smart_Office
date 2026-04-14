// TEST: Jalankan preload.js asli dengan sandbox: false
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 900, height: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,      // ← FIX UTAMA
      webSecurity: false,
      devTools: true,
    }
  });
  
  win.loadFile('test_preload_check.html');
  
  win.webContents.on('console-message', (e, level, msg) => {
    const prefix = ['LOG','WARN','ERR','DBG'][level] || '?';
    console.log(`[RENDERER-${prefix}] ${msg.substring(0, 400)}`);
  });
  
  win.webContents.on('preload-error', (e, p, error) => {
    console.error(`[PRELOAD-ERROR] ${error.message}`);
    console.error(`[PRELOAD-STACK] ${error.stack?.split('\n').slice(0,5).join(' | ')}`);
  });
});
