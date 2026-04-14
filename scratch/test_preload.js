// TEST PRELOAD: apakah contextBridge expose bekerja?
const { contextBridge } = require('electron');

console.log('[PRELOAD] Script dimulai...');

try {
  contextBridge.exposeInMainWorld('testBridge', {
    hello: 'world',
    nested: { apiKey: 'TEST_API_KEY_12345' }
  });
  console.log('[PRELOAD] contextBridge.exposeInMainWorld: SUKSES');
} catch (e) {
  console.error('[PRELOAD] contextBridge GAGAL:', e.message);
}

console.log('[PRELOAD] Script selesai.');
