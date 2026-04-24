const os = require('os');
const { app, dialog } = require('electron');

class PerformanceOptimizer {
    constructor() {
        this.totalMem = os.totalmem();
        this.totalMemGB = this.totalMem / (1024 * 1024 * 1024);
        this.isEntryLevel = this.totalMemGB < 4.0;
        
        console.log(`[OPTIMIZER] Total RAM: ${this.totalMemGB.toFixed(2)} GB | Entry Level: ${this.isEntryLevel}`);
    }

    init() {
        // 1. Hardware Profiling & Minimum Baseline
        if (this.totalMemGB < 2.0) {
            app.whenReady().then(() => {
                dialog.showMessageBox({
                    type: 'warning',
                    title: 'Spesifikasi Sistem Rendah',
                    message: 'RAM Anda di bawah 2GB.',
                    detail: 'Aplikasi akan tetap berjalan dalam Mode Entry-Level, namun kinerja mungkin terbatas. Fitur grafis kelas tinggi telah dimatikan secara otomatis untuk menjaga kestabilan sistem.',
                    buttons: ['Saya Mengerti']
                });
            });
        }

        // 2. V8 Memory Scaling: Max 25% of total RAM, min 1024MB (1GB).
        const memMB = this.totalMem / (1024 * 1024);
        let targetMem = Math.floor(memMB * 0.25);
        if (targetMem < 1024) targetMem = 1024;
        
        app.commandLine.appendSwitch('js-flags', `--max-old-space-size=${targetMem}`);
        console.log(`[OPTIMIZER] V8 Memory Limit set to ${targetMem} MB`);

        // 3. GPU Offloading (Force CSS rendering to GPU)
        app.commandLine.appendSwitch('enable-gpu-rasterization');
        app.commandLine.appendSwitch('ignore-gpu-blocklist');
        
        // Listen to memory pressure to clear cache
        app.on('memory-pressure', () => {
            console.warn('[OPTIMIZER] Memori hampir penuh! Melakukan pembersihan cache secara agresif...');
            // Paksa pembersihan cache jika memori menipis
            const wcs = require('electron').webContents.getAllWebContents();
            wcs.forEach(wc => {
                if (!wc.isDestroyed()) {
                    wc.clearHistory();
                }
            });
        });
    }

    get isLowEnd() {
        return this.isEntryLevel;
    }
}

module.exports = new PerformanceOptimizer();
