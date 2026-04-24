const os = require('os');
const { app, dialog } = require('electron');

class PerformanceOptimizer {
    constructor() {
        this.totalMem = os.totalmem();
        this.totalMemGB = this.totalMem / (1024 * 1024 * 1024);
        // Sistem operasi sering mereservasi memori (Hardware Reserved), 
        // sehingga RAM 4GB fisik akan terbaca sekitar 3.4 GB - 3.9 GB.
        // Berdasarkan log, laptop Anda terbaca 3.45 GB.
        // Kita gunakan batas 3.0 GB untuk mendeteksi perangkat yang benar-benar di bawah 4GB (misal RAM 2GB).
        this.isEntryLevel = this.totalMemGB < 3.0;

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

        // 2. Memory Scaling: Max 25% of total RAM, min 1024MB (1GB).
        const memMB = this.totalMem / (1024 * 1024);
        let targetMem = Math.floor(memMB * 0.25);
        if (targetMem < 1024) targetMem = 1024;

        app.commandLine.appendSwitch('js-flags', `--max-old-space-size=${targetMem}`);
        console.log(`[OPTIMIZER] Memory Limit set to ${targetMem} MB`);

        // 3. GPU Offloading & Hardware Acceleration Control
        if (this.isEntryLevel) {
            // Jika di bawah 4GB, matikan total hardware acceleration agar tidak membebani iGPU
            app.disableHardwareAcceleration();
            console.log('[OPTIMIZER] Hardware Acceleration dinonaktifkan (Mode Super Ringan)');
        } else {
            // Jika 4GB ke atas, biarkan Electron yang mengelola GPU secara cerdas (Default Behavior).
            // PENTING: Kita TIDAK memaksa 'ignore-gpu-blocklist' atau 'enable-gpu-rasterization' 
            // karena hal tersebut terbukti membuat iGPU crash (exit_code=34) dan layar menjadi blank.
            console.log('[OPTIMIZER] GPU Berjalan Default (Mode Normal Tanpa Pemaksaan)');
        }

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
