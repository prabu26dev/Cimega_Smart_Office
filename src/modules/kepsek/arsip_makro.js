window.ModulArsipMakro = {
  container: null,
  arsipData: [],

  init: async function() {
    this.container = document.getElementById('moduleArsipApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner-glowing"></div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where } = window._fb;
      const q = query(collection(db, 'arsip_makro'), where('sekolah', '==', userData.sekolah || ''));
      const snap = await getDocs(q);
      
      this.arsipData = [];
      snap.forEach(doc => {
        this.arsipData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) { console.error("Gagal memuat arsip:", e); }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗃️ ARSIP MAKRO INSTITUSI</div>
          <div>
            <button class="btn btn-primary" onclick="window.ModulArsipMakro.showForm()">+ Tambah Dokumen Makro</button>
          </div>
        </div>
        <div class="card-body">
          <p style="font-size:11px; color:var(--muted); margin-bottom:15px;">Repositori aman untuk meta-dokumen sekolah: KTSP/KOSP, RKT (Rencana Kerja Tahunan), dan RKJM (Rencana Kerja Jangka Menengah).</p>
          <div id="gridWrapperArsip"></div>
        </div>
      </div>

      <!-- FORM ADD ARSIP -->
      <div id="arsipFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:500px; border-color:var(--violet-light);">
          <div class="card-header">
            <div class="card-title">Upload Meta-Dokumen Institusi</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('arsipFormModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            
            <div class="form-group">
              <label class="form-label">Jenis Dokumen Makro</label>
              <select class="form-control" id="arJenis">
                <option value="KOSP (Kurikulum Operasional)">KOSP (Kurikulum Operasional Satuan Pendidikan)</option>
                <option value="RKJM (Rencana Jangka Menengah)">RKJM (Rencana Jangka Menengah)</option>
                <option value="RKT (Rencana Kerja Tahunan)">RKT (Rencana Kerja Tahunan)</option>
                <option value="Dokumen Akreditasi">Dokumen Persiapan Akreditasi</option>
              </select>
            </div>
            
            <div class="form-group"><label class="form-label">Nama / Judul Spesifik</label><input class="form-control" id="arJudul" placeholder="Contoh: KOSP Revisi TA 2024/2025" /></div>
            
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Tahun Terbit</label><input class="form-control" type="number" id="arTahun" placeholder="2024" /></div>
              <div class="form-group"><label class="form-label">Status Draft/Final</label>
                <select class="form-control" id="arStatus">
                  <option value="Draft">Drafting</option>
                  <option value="Final">Disahkan (Final)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Link Dokumen (G-Drive / Cloud Server)</label>
              <input class="form-control" type="url" id="arLink" placeholder="https://docs.google.com/..." />
            </div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; margin-top:10px;" onclick="window.ModulArsipMakro.saveData()">💾 Simpan Arsip Makro</button>
          </div>
        </div>
      </div>
    `;
  },

  initGrid: function() {
    const data = this.arsipData.map((a, idx) => [
      a.jenis || '-',
      a.judul || '-',
      a.tahun || '-',
      a.status === 'Final' ? gridjs.html('<span style="color:var(--success);font-weight:bold;">Final</span>') : gridjs.html('<span style="color:var(--muted);">Draft</span>'),
      gridjs.html(a.link ? \`<a href="\${a.link}" target="_blank" style="color:var(--cyan);">Buka Dokumen</a>\` : '-'),
      gridjs.html(\`<button class='btn btn-danger btn-sm' onclick='window.ModulArsipMakro.hapusData("\${a.id}")'>Hapus</button>\`)
    ]);

    new gridjs.Grid({
      columns: ['Jenis', 'Judul Dokumen', 'Tahun', 'Status', 'Tautan', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      language: { search: { placeholder: 'Cari Dokumen...' } }
    }).render(document.getElementById('gridWrapperArsip'));
  },

  showForm: function() {
    document.getElementById('arJudul').value = '';
    document.getElementById('arTahun').value = new Date().getFullYear();
    document.getElementById('arLink').value = '';
    document.getElementById('arsipFormModal').style.display = 'flex';
  },

  saveData: async function() {
    const data = {
      jenis: document.getElementById('arJenis').value,
      judul: document.getElementById('arJudul').value.trim(),
      tahun: document.getElementById('arTahun').value,
      status: document.getElementById('arStatus').value,
      link: document.getElementById('arLink').value.trim(),
      sekolah: userData.sekolah
    };

    if(!data.judul) { alert("Judul dokumen wajib diisi!"); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'arsip_makro'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('arsipFormModal').style.display = 'none';
      this.init(); // Reload
    } catch(e) { alert("Gagal menyimpan: " + e.message); }
  },

  hapusData: async function(id) {
    if(!confirm("Yakin menghapus arsip makro ini?")) return;
    try { const { doc, deleteDoc } = window._fb; await deleteDoc(doc(db, 'arsip_makro', id)); this.init(); } catch(e) { alert(e.message); }
  }
};
