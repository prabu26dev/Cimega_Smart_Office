// ── LOGIKA ADMIN: STUDIO MODUL BUILDER ───────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Event Listener untuk Role Toggle
    const roleButtons = document.querySelectorAll('.role-toggle');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
        });
    });

    // 2. Fitur Auto-Slug untuk ID Modul
    const nameInput = document.getElementById('builder-modul-name');
    const idInput = document.getElementById('builder-modul-id');
    if (nameInput && idInput) {
        nameInput.addEventListener('input', () => {
            if (!idInput.hasAttribute('readonly')) {
                idInput.value = nameInput.value.toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^\w\-]+/g, '');
            }
        });
    }
});

// ── HELPER: Ambil Firebase API yang siap pakai ──
function _getFirebase() {
    const fb = window._fb;
    if (!fb || !fb.db || !fb.setDoc || !fb.doc || !fb.getDoc) {
        throw new Error('Firebase belum siap. Coba beberapa saat lagi.');
    }
    return fb;
}

// ── FUNGSI KENDALI ANTARMUKA (Global Windows) ──
window._currentModulAdmin = null;

/**
 * Buka Workspace Editor — Context-Aware
 */
window.openModulWorkspace = async function(adminData) {
    if (!adminData || typeof adminData !== 'object' || !adminData.id) {
        if (window.showToast) window.showToast('warn', 'Pilih Administrasi', 'Klik tombol "🛠️ Konfigurasi Modul" pada kartu administrasi terlebih dahulu.');
        return;
    }

    window._currentModulAdmin = adminData;

    // Update breadcrumb
    const breadcrumb = document.getElementById('modul-workspace-breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <span style="color:var(--muted); font-size:10px;">Kelola Administrasi</span>
            <span style="color:var(--muted); margin:0 6px;">›</span>
            <span style="color:var(--muted); font-size:10px;">${adminData.kategori || 'Kategori'}</span>
            <span style="color:var(--muted); margin:0 6px;">›</span>
            <span style="color:#00e5ff; font-size:10px; font-weight:600;">${adminData.nama}</span>
            <span style="margin-left:10px; font-size:9px; background:rgba(0,229,255,0.1); color:#00e5ff; padding:2px 8px; border-radius:4px; border:1px solid rgba(0,229,255,0.3);">MODUL BUILDER</span>
        `;
    }

    // Kunci Nama tapi bebaskan ID agar bisa diedit
    const idInput = document.getElementById('builder-modul-id');
    const nameInput = document.getElementById('builder-modul-name');
    if (idInput) { idInput.value = adminData.id; idInput.removeAttribute('readonly'); }
    if (nameInput) { nameInput.value = adminData.nama; nameInput.setAttribute('readonly', 'true'); }

    // Reset field
    const htmlEl   = document.getElementById('builder-html');
    const jsEl     = document.getElementById('builder-js');
    const promptEl = document.getElementById('builder-prompt');
    if (htmlEl)   htmlEl.value   = '';
    if (jsEl)     jsEl.value     = '';
    if (promptEl) promptEl.value = '';
    document.querySelectorAll('.role-toggle').forEach(btn => btn.classList.remove('active'));

    // Tampilkan modal
    if (typeof openModal === 'function') openModal('modalModulBuilder');

    // Fetch data yang sudah ada dari Firestore
    try {
        const fb   = _getFirebase();
        const snap = await fb.getDoc(fb.doc(fb.db, 'modul_dinamis', adminData.id));
        if (snap.exists()) {
            const existing = snap.data();
            if (htmlEl)   htmlEl.value   = existing.koding_html || '';
            if (jsEl)     jsEl.value     = existing.koding_js   || '';
            if (promptEl) promptEl.value = existing.ai_prompt   || '';
            document.querySelectorAll('.role-toggle').forEach(btn => {
                if ((existing.akses_role || []).includes(btn.getAttribute('data-role'))) {
                    btn.classList.add('active');
                }
            });
            if (window.showToast) window.showToast('info', 'Data Dimuat', `Konfigurasi modul "${adminData.nama}" berhasil dimuat.`);
        } else {
            if (window.showToast) window.showToast('info', 'Modul Baru', `Buat konfigurasi baru untuk "${adminData.nama}".`);
        }
    } catch (e) {
        console.warn('[ModulBuilder] Gagal fetch:', e.message);
        if (window.showToast) window.showToast('warn', 'Peringatan', 'Gagal memuat data dari Cloud: ' + e.message);
    }
};

// Tutup modal
window.closeModulWorkspace = function() {
    window._currentModulAdmin = null;
    if (typeof closeModal === 'function') closeModal('modalModulBuilder');
};

/**
 * Simpan Konfigurasi Modul — Langsung tutup modal setelah berhasil
 */
window.saveModulConfig = async function() {
    const currentAdmin = window._currentModulAdmin;

    if (!currentAdmin || !currentAdmin.id) {
        if (window.showToast) window.showToast('error', 'Konteks Hilang', 'Buka modul builder melalui tombol "🛠️ Konfigurasi Modul" pada kartu.');
        return;
    }

    // Ambil ID dari input (karena sekarang admin bisa mengeditnya)
    const idInput = document.getElementById('builder-modul-id');
    const id      = idInput ? idInput.value.trim() : currentAdmin.id;
    const name    = currentAdmin.nama;
    const htmlContent   = (document.getElementById('builder-html')   || {}).value || '';
    const jsContent     = (document.getElementById('builder-js')     || {}).value || '';
    const promptContent = (document.getElementById('builder-prompt') || {}).value || '';

    // Kumpulkan role yang aktif
    const activeRoles = [];
    document.querySelectorAll('.role-toggle.active').forEach(btn => {
        activeRoles.push(btn.getAttribute('data-role'));
    });

    // Role bersifat opsional — hanya tampilkan peringatan, tidak blokir save
    if (activeRoles.length === 0) {
        if (window.showToast) window.showToast('warn', 'Perhatian', 'Tidak ada Role Akses dipilih. Modul hanya bisa diakses Admin.');
    }

    // Validasi minimal: minimal HTML atau JS harus ada
    if (!htmlContent.trim() && !jsContent.trim()) {
        if (window.showToast) window.showToast('warn', 'Perhatian', 'Isi minimal HTML atau JavaScript sebelum menyimpan.');
        return;
    }

    if (window.showToast) window.showToast('info', 'Menyimpan...', `Menyimpan modul "${name}"...`);

    // Siapkan data
    let timestamp;
    try {
        timestamp = (_getFirebase().serverTimestamp) ? _getFirebase().serverTimestamp() : new Date().toISOString();
    } catch (_) {
        timestamp = new Date().toISOString();
    }

    const modulData = {
        id,
        nama:        name,
        kategori:    currentAdmin.kategori || '',
        akses_role:  activeRoles,
        koding_html: htmlContent,
        koding_js:   jsContent,
        ai_prompt:   promptContent,
        diperbarui:  timestamp,
    };

    try {
        const fb = _getFirebase();

        // Simpan ke modul_dinamis/{id}
        await fb.setDoc(fb.doc(fb.db, 'modul_dinamis', id), modulData);

        // Merge ke konten/{id} (non-fatal jika gagal)
        try {
            await fb.setDoc(fb.doc(fb.db, 'konten', id), { 
                nama: name,
                kategori: currentAdmin.kategori || 'modul_dinamis',
                visibleTo: activeRoles.length > 0 ? activeRoles : ['admin'],
                modul: modulData 
            }, { merge: true });
        } catch (mergeErr) {
            console.warn('[ModulBuilder] Merge konten gagal (non-fatal):', mergeErr.message);
        }

        console.log('📦 Modul berhasil disimpan:', modulData);
        if (window.showToast) window.showToast('success', 'Tersimpan!', `Modul "${name}" berhasil disimpan di Cloud.`);

        // Tutup modal otomatis setelah simpan
        window.closeModulWorkspace();

    } catch (error) {
        console.error('[ModulBuilder] Gagal simpan:', error);
        if (window.showToast) window.showToast('error', 'Gagal Simpan', error.message);
    }
};
