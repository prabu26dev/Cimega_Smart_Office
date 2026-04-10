window.ModulRkas = {
  container: null,
  rkasData: [],
  bospLimit: 150000000, // Misal Anggaran BOSP 1 sekolah 150 Juta

  init: async function() {
    this.container = document.getElementById('moduleRkasApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner" style="border-top-color:var(--gold);width:30px;height:30px"></div><div style="margin-top:14px;color:var(--muted)">Menarik Data RKAS...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where } = window._fb;
      const q = query(collection(db, 'rkas'), where('sekolah', '==', userData.sekolah || ''));
      const snap = await getDocs(q);
      
      this.rkasData = [];
      snap.forEach(doc => {
        this.rkasData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat RKAS:", e);
    }
  },

  render: function() {
    // Math.round absolute total calculation to avoid parsing floating points
    const totalAnggaran = this.rkasData.reduce((sum, item) => sum + Math.round(Number(item.total_pagu) || 0), 0);
    const sisaBosp = this.bospLimit - totalAnggaran;
    const isOverBudget = sisaBosp < 0;

    this.container.innerHTML = `
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="stat-box" style="background:rgba(255,208,0,0.05); border-color:var(--border);">
          <div style="font-size:11px;color:var(--muted);">Total Pagu BOSP Tersedia</div>
          <div class="stat-num" style="color:var(--gold);">${window.formatIDR(this.bospLimit)}</div>
        </div>
        <div class="stat-box" style="background:rgba(0,255,136,0.05); border-color:rgba(0,255,136,0.2);">
          <div style="font-size:11px;color:var(--muted);">Total Direncanakan (RKAS)</div>
          <div class="stat-num" style="color:var(--success);">${window.formatIDR(totalAnggaran)}</div>
        </div>
        <div class="stat-box" style="background:${isOverBudget ? 'rgba(255,68,102,0.1)' : 'rgba(0,229,255,0.05)'}; border-color:${isOverBudget ? 'var(--danger)' : 'rgba(0,229,255,0.2)'};">
          <div style="font-size:11px;color:var(--muted);">Sisa Anggaran Belum Terpakai</div>
          <div class="stat-num" style="color:${isOverBudget ? 'var(--danger)' : 'var(--cyan)'};">${window.formatIDR(sisaBosp)}</div>
        </div>
      </div>

      ${isOverBudget ? \`<div style="background:rgba(255,68,102,0.1); border:1px solid var(--danger); padding:10px 14px; border-radius:8px; margin-bottom:20px; color:#ff8899; font-size:12px; display:flex; align-items:center; gap:10px;">
        <span style="font-size:16px;">⚠️</span> <strong>PERINGATAN DEFISIT:</strong> Total Rencana Anggaran (RKAS) Anda telah melebihi Pagu BOSP Sekolah! Pagu RKAS tidak boleh minus.
      </div>\` : ''}

      <div class="card">
        <div class="card-header">
          <div class="card-title">📑 TABEL E-RKAS (8 SNP)</div>
          <div>
            <button class="btn btn-primary" onclick="window.ModulRkas.showForm()">+ Tambah Rencana Belanja</button>
          </div>
        </div>
        <div class="card-body">
          <div id="gridWrapperRkas"></div>
        </div>
      </div>

      <!-- FORM ADD/EDIT RKAS -->
      <div id="rkasFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:700px; border-color:var(--gold);">
          <div class="card-header">
            <div class="card-title" id="rkasFormTitle">Tambah Rencana Kegiatan (RKAS)</div>
            <button class="btn btn-ghost" onclick="document.getElementById('rkasFormModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Kode Rekening</label><input class="form-control" id="rkKode" placeholder="5.1.02.01.01.0024" /></div>
              <div class="form-group">
                <label class="form-label">Standar Nasional Pendidikan (8 SNP)</label>
                <select class="form-control" id="rkSnp">
                  <option value="1. Standar Kompetensi Lulusan">1. Standar Kompetensi Lulusan</option>
                  <option value="2. Standar Isi">2. Standar Isi</option>
                  <option value="3. Standar Proses">3. Standar Proses</option>
                  <option value="4. Standar Penilaian">4. Standar Penilaian</option>
                  <option value="5. Standar PTK">5. Standar PTK</option>
                  <option value="6. Standar Sarpras">6. Standar Sarpras</option>
                  <option value="7. Standar Pengelolaan">7. Standar Pengelolaan</option>
                  <option value="8. Standar Pembiayaan">8. Standar Pembiayaan</option>
                </select>
              </div>
            </div>
            
            <div class="form-group"><label class="form-label">Uraian / Deskripsi Kegiatan</label><textarea class="form-control" id="rkUraian" placeholder="Belanja Alat Tulis Kantor (ATK)"></textarea></div>

            <div class="grid-3">
              <div class="form-group"><label class="form-label">Volume (Jumlah)</label><input class="form-control" type="number" id="rkVol" oninput="window.ModulRkas.calcPagu()" /></div>
              <div class="form-group"><label class="form-label">Satuan</label><input class="form-control" id="rkSatuan" placeholder="Rim / Box / Rim" /></div>
              <div class="form-group"><label class="form-label">Harga Satuan (Rp)</label><input class="form-control" type="number" id="rkHarga" oninput="window.ModulRkas.calcPagu()" /></div>
            </div>

            <div style="background:rgba(0,255,136,0.05); border:1px solid rgba(0,255,136,0.2); padding:12px; border-radius:8px; text-align:center; margin-bottom:15px;">
              <div style="font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Total Pagu Anggaran</div>
              <div style="font-size:20px; font-weight:700; color:var(--success); font-family:'Orbitron',sans-serif;" id="rkTotalDisplay">Rp 0</div>
            </div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="window.ModulRkas.saveData()">💾 Simpan Rencana Anggaran</button>
          </div>
        </div>
      </div>
    `;
  },

  calcPagu: function() {
    const vol = parseFloat(document.getElementById('rkVol').value) || 0;
    const price = parseFloat(document.getElementById('rkHarga').value) || 0;
    
    // Math.round() logic to avoid floating point anomalies inherently
    const total = Math.round(vol * price);
    document.getElementById('rkTotalDisplay').innerText = window.formatIDR(total);
    // Expose internally
    this._tempTotalPagu = total;
  },

  initGrid: function() {
    const data = this.rkasData.map((r, idx) => [
      r.kode || '-',
      r.uraian || '-',
      r.snp || '-',
      r.volume || '-',
      window.formatIDR(Math.round(r.harga_satuan || 0)),
      window.formatIDR(Math.round(r.total_pagu || 0)),
      gridjs.html(\`<button class='btn btn-ghost btn-sm' onclick='window.ModulRkas.hapusData("\${r.id}")'>Hapus</button>\`)
    ]);

    this.gridInstance = new gridjs.Grid({
      columns: ['Kode Rek', 'Uraian Kegiatan', 'SNP', 'Vol', 'Harga Satuan', 'Total Pagu', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      sort: true,
      language: {
        search: { placeholder: 'Cari Rencana...' },
        pagination: { previous: 'Prev', next: 'Next', showing: 'Data', results: () => 'RKAS' }
      }
    }).render(document.getElementById('gridWrapperRkas'));
  },

  showForm: function() {
    document.getElementById('rkKode').value = '';
    document.getElementById('rkUraian').value = '';
    document.getElementById('rkVol').value = '';
    document.getElementById('rkSatuan').value = '';
    document.getElementById('rkHarga').value = '';
    this.calcPagu();
    document.getElementById('rkasFormModal').style.display = 'flex';
  },

  saveData: async function() {
    const data = {
      kode: document.getElementById('rkKode').value.trim(),
      snp: document.getElementById('rkSnp').value,
      uraian: document.getElementById('rkUraian').value.trim(),
      volume: parseFloat(document.getElementById('rkVol').value) || 0,
      satuan: document.getElementById('rkSatuan').value.trim(),
      // Force Absolute Integer Rounding
      harga_satuan: Math.round(parseFloat(document.getElementById('rkHarga').value) || 0),
      total_pagu: Math.round(this._tempTotalPagu || 0),
      sekolah: userData.sekolah
    };

    if(!data.uraian || data.total_pagu <= 0) { alert("Uraian dan Nominal wajar wajib diisi!"); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'rkas'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('rkasFormModal').style.display = 'none';
      this.init(); // Reload
    } catch(e) {
      alert("Gagal menyimpan RKAS: " + e.message);
    }
  },

  hapusData: async function(id) {
    if(!confirm("Yakin menghapus kegiatan ini dari RKAS?")) return;
    try {
      const { doc, deleteDoc } = window._fb;
      await deleteDoc(doc(db, 'rkas', id));
      this.init();
    } catch(e) { alert("Gagal hapus: " + e.message); }
  }
};
