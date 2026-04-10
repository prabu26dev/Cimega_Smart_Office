'use strict';

window.ModulCloudDrive = {
    container: null,
    files: [],
    userData: null,

    init: async function() {
        this.container = document.getElementById('gridWrapperCloud');
        this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
        if (!this.container) return;
        
        this.renderSkeleton();
        await this.loadFiles();
    },

    renderSkeleton: function() {
        this.container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <div class="spinner" style="border-top-color:var(--purple);width:30px;height:30px"></div>
                <div style="margin-top:14px;color:var(--muted)">Menghubungkan ke Cloud Storage...</div>
            </div>
        `;
    },

    loadFiles: async function() {
        if (!window._supabase) {
            this.container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>Supabase belum terkonfigurasi. Cek file .env Anda.</p></div>`;
            return;
        }

        try {
            const schoolId = this.userData.school_id || 'Global';
            
            // List files in the school's folder
            const { data, error } = await window._supabase
                .storage
                .from('cimega-cloud')
                .list(`schools/${schoolId}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' }
                });

            if (error) throw error;

            this.files = data || [];
            this.renderTable();
        } catch (e) {
            console.error("Gagal memuat Cloud Drive:", e);
            this.container.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p>Error: ${e.message}</p></div>`;
        }
    },

    renderTable: function() {
        if (this.files.length === 0) {
            this.container.innerHTML = `<div class="empty-state"><div class="icon">☁️</div><p>Drive kosong. Klik "Unggah File" untuk memulai.</p></div>`;
            return;
        }

        const data = this.files.filter(f => f.name !== '.emptyFolderPlaceholder').map(file => {
            const size = (file.metadata?.size / 1024).toFixed(2) + ' KB';
            const date = new Date(file.created_at).toLocaleString('id-ID');
            const schoolId = this.userData.school_id || 'Global';
            const publicUrl = window._supabase.storage.from('cimega-cloud').getPublicUrl(`schools/${schoolId}/${file.name}`).data.publicUrl;

            return [
                file.name,
                size,
                date,
                gridjs.html(`
                    <div style="display:flex; gap:6px">
                        <button class="btn btn-ghost btn-sm" onclick="window.cimegaAPI.openExternal('${publicUrl}')">🔗 Buka</button>
                        <button class="btn btn-danger btn-sm" onclick="window.ModulCloudDrive.deleteFile('${file.name}')">🗑</button>
                    </div>
                `)
            ];
        });

        this.container.innerHTML = '';
        new gridjs.Grid({
            columns: ['Nama File', 'Ukuran', 'Tanggal Unggah', 'Aksi'],
            data: data,
            search: true,
            pagination: { limit: 10 },
            sort: true,
            style: {
                table: { fontSize: '11px' },
                th: { background: 'rgba(170,85,255,0.05)', color: 'var(--purple)' }
            }
        }).render(this.container);
    },

    openUpload: function() {
        document.getElementById('uploadDrawer').style.display = 'block';
    },

    handleFileSelect: async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('error', 'Gagal', 'Ukuran file maksimal 5MB.');
            return;
        }

        const schoolId = this.userData.school_id || 'Global';
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `schools/${schoolId}/${fileName}`;

        // Show UI progress
        const container = document.getElementById('uploadProgressContainer');
        const bar = document.getElementById('barProgress');
        const pct = document.getElementById('pctProgress');
        const nameLabel = document.getElementById('fileNameProgress');

        container.style.display = 'block';
        nameLabel.textContent = file.name;
        bar.style.width = '0%';
        pct.textContent = '0%';

        try {
            const { data, error } = await window._supabase
                .storage
                .from('cimega-cloud')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Update Progress to 100%
            bar.style.width = '100%';
            pct.textContent = '100%';

            // Get Public URL
            const { data: urlData } = window._supabase.storage.from('cimega-cloud').getPublicUrl(filePath);
            
            // Record to Firestore metadata (for Admin Oversight)
            const { collection, addDoc, serverTimestamp } = window._fb;
            await addDoc(collection(db, 'cloud_files'), {
                nama: file.name,
                file_path: filePath,
                file_url: urlData.publicUrl,
                size: file.size,
                school_id: schoolId,
                sekolah: this.userData.sekolah,
                uploader_name: this.userData.nama,
                uploader_id: this.userData.id,
                createdAt: serverTimestamp()
            });

            showToast('success', 'Berhasil', 'File berhasil diunggah ke cloud.');
            
            setTimeout(() => {
                container.style.display = 'none';
                document.getElementById('uploadDrawer').style.display = 'none';
                this.loadFiles();
            }, 1000);

        } catch (err) {
            console.error("Upload failed:", err);
            showToast('error', 'Gagal', 'Terjadi kesalahan saat mengunggah file.');
            container.style.display = 'none';
        }
    },

    deleteFile: async function(fileName) {
        if (!confirm(`Yakin ingin menghapus file "${fileName}" secara permanen dari cloud?`)) return;

        try {
            const schoolId = this.userData.school_id || 'Global';
            const filePath = `schools/${schoolId}/${fileName}`;

            const { error } = await window._supabase
                .storage
                .from('cimega-cloud')
                .remove([filePath]);

            if (error) throw error;

            // Also remove from Firestore record if it exists
            const { collection, query, where, getDocs, deleteDoc, doc } = window._fb;
            const q = query(collection(db, 'cloud_files'), where('file_path', '==', filePath));
            const snap = await getDocs(q);
            snap.forEach(async (d) => {
                await deleteDoc(doc(db, 'cloud_files', d.id));
            });

            showToast('success', 'Dihapus', 'File telah dihapus.');
            this.loadFiles();
        } catch (err) {
            showToast('error', 'Gagal', err.message);
        }
    }
};
