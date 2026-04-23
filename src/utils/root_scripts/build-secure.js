const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { globSync } = require('glob');

async function runSecureBuild() {
    console.log("============== CIMEGA SECURE BUILD ==============");
    console.log("[1/5] Memulai proses backup source code murni...");

    // 1. Backup file asli agar ruang kerja (workspace) tetap aman
    fs.copySync('src', '.src_backup');
    fs.copyFileSync('main.js', '.main_backup.js');
    fs.copyFileSync('preload.js', '.preload_backup.js');

    try {
        console.log("[2/5] Mengacak (Obfuscate) kode javascript menjadi heksadesimal...");
        
        // Kumpulkan semua file JS yang akan diobfuscate
        const jsFiles = globSync('src/**/*.js', { ignore: 'node_modules/**' }).concat(['main.js', 'preload.js']);
        
        jsFiles.forEach(file => {
            const code = fs.readFileSync(file, 'utf8');
            const result = JavaScriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,       // Membuat logika berputar-putar rumit
                controlFlowFlatteningThreshold: 0.7,
                debugProtection: true,             // 🛑 ANTI-DEBUGGER: Membekukan browser hacker
                debugProtectionInterval: 4000,
                disableConsoleOutput: true,        // Menghilangkan semua console.log
                identifierNamesGenerator: 'hexadecimal', // Variabel menjadi _0x4d3f
                selfDefending: true,               // Memblokir format ualng (beautify)
                stringArray: true,
                stringArrayEncoding: ['base64', 'rc4'],
                splitStrings: true,
                splitStringsChunkLength: 5
            });
            fs.writeFileSync(file, result.getObfuscatedCode(), 'utf8');
        });

        console.log("[3/5] Koding berhasil diajak dan diamankan. Memulai proses Build Installer...");
        
        // 2. Jalankan electron-builder
        // Installer akan membungkus kodingan "rusak" tersebut
        execSync('npx electron-builder --win --x64', { stdio: 'inherit' });

        console.log("[4/5] Build Selesai. Ekstraksi Installer sukses!");

    } catch (e) {
        console.error("Terjadi Kesalahan saat proses Build: ", e.message);
    } finally {
        console.log("[5/5] Memulihkan source code murni ke ruang kerja...");
        
        // 3. Restore file asli bagaimanapun hasil build-nya (sukses/gagal)
        fs.removeSync('src');                     // Hapus folder src yang sudah dienkripsi
        fs.renameSync('.src_backup', 'src');      // Kembalikan folder asli
        
        fs.removeSync('main.js');
        fs.renameSync('.main_backup.js', 'main.js');
        
        fs.removeSync('preload.js');
        fs.renameSync('.preload_backup.js', 'preload.js');

        console.log("============== SELESAI ==============");
        console.log("Source code aman, Installer `.exe` dengan keamanan tingkat tinggi siap didistribusikan!");
    }
}

// Menghandle proses kill paksa agar file tidak hilang (Ctrl+C manual)
process.on('SIGINT', () => {
    console.log("\nProses dibatalkan pengguna. Memulihkan file asli...");
    if (fs.existsSync('.src_backup')) {
        fs.removeSync('src');
        fs.renameSync('.src_backup', 'src');
    }
    if (fs.existsSync('.main_backup.js')) {
        fs.removeSync('main.js');
        fs.renameSync('.main_backup.js', 'main.js');
    }
    if (fs.existsSync('.preload_backup.js')) {
        fs.removeSync('preload.js');
        fs.renameSync('.preload_backup.js', 'preload.js');
    }
    process.exit();
});

runSecureBuild();
