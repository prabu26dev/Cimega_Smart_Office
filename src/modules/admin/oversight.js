'use strict';

window.ModulOversight = {
    container: null,
    docs: [],

    init: async function() {
        this.container = document.getElementById('gridWrapperOversight');
        if (!this.container) return;
        this.renderSkeleton();
        await this.loadData();
    },

    renderSkeleton: function() {
        this.container.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <div class="spinner" style="border-top-color:var(--cyan);width:30px;height:30px"></div>
                <div style="margin-top:14px;color:var(--muted)">Memuat arsip dokumen lintas sekolah...</div>
            </div>
        `;
    },

    loadData: async function() {
        try {
            const { collection, getDocs, orderBy, query, limit } = window._fb;
            const filter = document.getElementById('oversightColFilter').value;
            
            let collectionsToFetch = [];
            if (filter === 'all') {
                collectionsToFetch = ['perencanaan', 'arsip_makro', 'asesmen', 'pelaksanaan', 'keuangan', 'cloud_files'];
            } else {
                collectionsToFetch = [filter];
            }

            this.docs = [];
            
            // Fetch parallel from selected collections
            const promises = collectionsToFetch.map(colName => 
                getDocs(query(collection(db, colName), orderBy('createdAt', 'desc'), limit(50)))
                .then(snap => {
                    snap.forEach(doc => {
                        this.docs.push({ 
                            id: doc.id, 
                            _collection: colName,
                            ...doc.data() 
                        });
                    });
                })
                .catch(err => console.warn(`Gagal memuat koleksi ${colName}:`, err))
            );

            await Promise.all(promises);

            // Sort all by date (newest first)
            this.docs.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });

            this.renderTable();
        } catch (e) {
            console.error("Gagal memuat Data Oversight:", e);
            this.container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>Error: ${e.message}</p></div>`;
        }
    },

    renderTable: function() {
        if (this.docs.length === 0) {
            this.container.innerHTML = `<div class="empty-state"><div class="icon">📁</div><p>Tidak ditemukan dokumen dalam koleksi ini.</p></div>`;
            return;
        }

        this.container.innerHTML = ''; // Clear skeleton
        
        const data = this.docs.map(doc => {
            const date = doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toLocaleString('id-ID') : '-';
            const author = doc.teacher_name || doc.admin || doc.username || 'System';
            const school = doc.sekolah || doc.school_id || 'Global/Internal';
            const category = this.getFriendlyCategory(doc._collection);

            return [
                doc.nama || doc.judul || doc.title || 'Tanpa Judul',
                gridjs.html(`<span class="badge" style="background:rgba(0,229,255,0.1); color:var(--cyan)">${category}</span>`),
                author,
                school,
                date,
                gridjs.html(`
                    <div style="display:flex; gap:6px">
                        <button class="btn btn-ghost btn-sm" onclick="window.ModulOversight.viewDoc('${doc._collection}', '${doc.id}')">👁️ Lihat</button>
                        <button class="btn btn-danger btn-sm" onclick="window.ModulOversight.deleteDoc('${doc._collection}', '${doc.id}', '${(doc.nama || doc.judul || 'Dokumen').replace(/'/g, "\\'")}')">🗑</button>
                    </div>
                `)
            ];
        });

        new gridjs.Grid({
            columns: ['Nama Dokumen', 'Kategori', 'Pembuat', 'Institusi', 'Waktu', 'Aksi'],
            data: data,
            search: true,
            pagination: { limit: 12 },
            sort: true,
            resizable: true,
            language: {
                search: { placeholder: 'Cari dokumen, user, atau sekolah...' },
                pagination: { previous: 'Prev', next: 'Next', showing: 'Menampilkan', results: () => 'data' }
            },
            style: {
                table: { border: 'none', fontSize: '11px' },
                th: { background: 'rgba(0,229,255,0.05)', color: 'var(--cyan)', border: 'none', borderBottom: '1px solid var(--border)' },
                td: { background: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,229,255,0.05)', color: 'var(--text)' }
            }
        }).render(this.container);
    },

    getFriendlyCategory: function(col) {
        const map = {
            'perencanaan': '📚 Akademik',
            'arsip_makro': '🏛️ Institusi',
            'asesmen': '📊 Penilaian',
            'pelaksanaan': '📝 Jurnal',
            'keuangan': '💰 Keuangan',
            'cloud_files': '☁️ Cloud Drive'
        };
        return map[col] || col;
    },

    viewDoc: async function(col, id) {
        // Handle Cloud Files differently (open URL)
        if (col === 'cloud_files') {
            const found = this.docs.find(d => d.id === id);
            if (found && found.file_url) {
                window.cimegaAPI.openExternal(found.file_url);
                return;
            }
        }

        try {
            const { doc, getDoc } = window._fb;
            const snap = await getDoc(doc(db, col, id));
            if (!snap.exists()) {
                showToast('error', 'Error', 'Dokumen tidak ditemukan');
                return;
            }
            const data = snap.data();
            
            // Simpel Preview Modal (Gunakan modal existing atau buat dummy)
            const content = JSON.stringify(data, null, 2);
            
            // Gunakan alert atau modal kustom jika tersedia
            // Di sini kita buat modal sederhana saja
            this.showPreviewModal(data.nama || data.judul || 'Detail Dokumen', data);
            
        } catch (err) {
            showToast('error', 'Error', err.message);
        }
    },

    showPreviewModal: function(title, data) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-overlay show';
        modalDiv.id = 'tempModalOversight';
        
        let bodyHtml = '';
        if (data.pertanyaan_pemantik) {
             bodyHtml = `
                <div style="font-size:12px">
                    <h4 style="color:var(--cyan); margin-bottom:8px">Langkah Kegiatan:</h4>
                    <pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; white-space:pre-wrap; color:#fff">${JSON.stringify(data.langkah_kegiatan, null, 2)}</pre>
                </div>
             `;
        } else {
             bodyHtml = `<pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; white-space:pre-wrap; color:#fff; font-size:11px">${JSON.stringify(data, null, 2)}</pre>`;
        }

        modalDiv.innerHTML = `
            <div class="modal" style="max-width:700px">
                <div class="modal-header">
                    <div class="modal-title">${title}</div>
                    <button class="modal-close" onclick="document.getElementById('tempModalOversight').remove()">✕</button>
                </div>
                <div class="modal-body" style="padding:10px 0">
                    ${bodyHtml}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="document.getElementById('tempModalOversight').remove()">Tutup</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    deleteDoc: async function(col, id, name) {
        if (!confirm(`⚠️ PERINGATAN KEAMANAN: Anda akan menghapus dokumen "${name}" secara permanen dari server. Tindakan ini tidak bisa dibatalkan.\n\nLanjutkan?`)) return;
        
        try {
            const { doc, deleteDoc } = window._fb;
            await deleteDoc(doc(db, col, id));
            
            // If it's a cloud file, we might want to suggest manual cleanup in Supabase
            // but for safety, we've already removed the metadata from Firestore.
            
            showToast('success', 'Dihapus', `Dokumen "${name}" berhasil dihapus.`);
            addLog('Keamanan', `Admin menghapus dokumen ${name} dari koleksi ${col}`);
            this.loadData(); // Refresh table
        } catch (err) {
            showToast('error', 'Gagal', err.message);
        }
    }
};
