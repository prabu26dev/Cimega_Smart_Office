window.ModulBku = {
  container: null,
  bkuData: [],
  gridFilter: 'SEMUA',

  init: async function() {
    this.container = document.getElementById('moduleBkuApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner" style="border-top-color:var(--gold);width:30px;height:30px"></div><div style="margin-top:14px;color:var(--muted)">Menarik Data BKU...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const q = query(collection(db, 'bku'), where('sekolah', '==', userData.sekolah || ''), orderBy('tanggal', 'asc'));
      const snap = await getDocs(q);
      
      this.bkuData = [];
      snap.forEach(doc => {
        this.bkuData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat BKU:", e);
    }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📘 BUKU KAS UMUM (BKU) & PEMBANTU</div>
          <div style="display:flex; gap:10px; align-items:center;">
            <select class="form-control" style="width:180px; padding:6px; font-size:11px;" id="bkuFilter" onchange="window.ModulBku.switchFilter(this.value)">
              <option value="SEMUA">Buku Kas Umum (Semua)</option>
              <option value="KAS">Buku Pembantu Kas</option>
              <option value="BANK">Buku Pembantu Bank</option>
              <option value="PAJAK">Buku Pembantu Pajak</option>
            </select>
            <button class="btn btn-primary" onclick="window.ModulBku.showForm()">+ Transaksi BKU</button>
          </div>
        </div>
        <div class="card-body">
          <div id="gridWrapperBku"></div>
        </div>
      </div>

      <!-- FORM ADD BKU -->
      <div id="bkuFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:600px; border-color:var(--gold);">
          <div class="card-header">
            <div class="card-title">Input Transaksi BKU</div>
            <button class="btn btn-ghost" onclick="document.getElementById('bkuFormModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Tanggal Transaksi</label><input type="date" class="form-control" id="bkuTanggal" /></div>
              <div class="form-group"><label class="form-label">No. Bukti / Referensi</label><input class="form-control" id="bkuBukti" placeholder="BKK-001 / BKM-001" /></div>
            </div>
            
            <div class="form-group"><label class="form-label">Uraian Transaksi</label><textarea class="form-control" id="bkuUraian" placeholder="Penarikan Tunai dari Bank / Belanja ATK"></textarea></div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Tipe Pembantu (Tagging)</label>
                <select class="form-control" id="bkuTipe">
                  <option value="KAS">Tunai / Kas</option>
                  <option value="BANK">Transfer / Bank</option>
                  <option value="PAJAK">Setoran / Pungutan Pajak</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Jenis Pembiayaan</label>
                <select class="form-control" id="bkuJenis">
                  <option value="DEBET">Penerimaan (Debet)</option>
                  <option value="KREDIT">Pengeluaran (Kredit)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Nominal (Rp)</label>
              <input class="form-control" type="number" id="bkuNominal" placeholder="Contoh: 1500000" />
            </div>

            <div style="background:rgba(255,170,0,0.1); border:1px solid var(--warn); padding:10px; border-radius:8px; font-size:11px; color:var(--warn); margin-bottom:15px; display:flex; gap:10px;">
              <span>ℹ️</span> Saldo akan dihitung secara otomatis (Auto-Rolling Balance) berdasarkan urutan tanggal sistem. Pastikan tanggal dan nominal mutlak benar.
            </div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="window.ModulBku.saveData()">💾 Simpan Ke BKU</button>
          </div>
        </div>
      </div>
    `;
  },

  switchFilter: function(val) {
    this.gridFilter = val;
    this.initGrid();
  },

  initGrid: function() {
    let runningBalance = 0;
    
    // Sort chronologically to compute trailing balance perfectly
    const sortedData = [...this.bkuData].sort((a,b) => new Date(a.tanggal) - new Date(b.tanggal));
    const formattedData = [];

    sortedData.forEach((row, idx) => {
      // Float Math Mitigation: Strict extraction and parsing to Math.round absolute Int.
      const debet = Math.round(Number(row.debet) || 0);
      const kredit = Math.round(Number(row.kredit) || 0);
      
      // Dynamic Balance (Saldo) Equation
      runningBalance = runningBalance + debet - kredit;

      // Filter View Implementation
      if(this.gridFilter === 'SEMUA' || row.tipe === this.gridFilter) {
        formattedData.push([
          row.tanggal || '-',
          row.no_bukti || '-',
          row.uraian || '-',
          window.formatIDR(debet),
          window.formatIDR(kredit),
          window.formatIDR(runningBalance),
          gridjs.html(\`<button class='btn btn-ghost btn-sm' onclick='window.ModulBku.hapusData("\${row.id}")'>Hapus</button>\`)
        ]);
      }
    });

    const wrapper = document.getElementById('gridWrapperBku');
    wrapper.innerHTML = ''; // reset wrapping since gridjs appends

    new gridjs.Grid({
      columns: ['Tanggal', 'No. Bukti', 'Uraian', 'Debet (Masuk)', 'Kredit (Keluar)', 'Saldo', 'Aksi'],
      data: formattedData,
      search: true,
      pagination: { limit: 12 },
      language: {
        search: { placeholder: 'Cari Transaksi...' },
        pagination: { previous: 'Prev', next: 'Next', showing: 'Data', results: () => 'Baris' }
      }
    }).render(wrapper);
  },

  showForm: function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bkuTanggal').value = today;
    document.getElementById('bkuBukti').value = '';
    document.getElementById('bkuUraian').value = '';
    document.getElementById('bkuNominal').value = '';
    document.getElementById('bkuFormModal').style.display = 'flex';
  },

  saveData: async function() {
    const tanggal = document.getElementById('bkuTanggal').value;
    const no_bukti = document.getElementById('bkuBukti').value.trim();
    const uraian = document.getElementById('bkuUraian').value.trim();
    const tipe = document.getElementById('bkuTipe').value;
    const jenis = document.getElementById('bkuJenis').value;
    
    // Float mitigation
    const nominal = Math.round(parseFloat(document.getElementById('bkuNominal').value) || 0);

    if(!tanggal || !uraian || nominal <= 0) { alert("Data tidak lengkap atau nominal salah!"); return; }

    const debet = jenis === 'DEBET' ? nominal : 0;
    const kredit = jenis === 'KREDIT' ? nominal : 0;

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'bku'), { 
        tanggal, no_bukti, uraian, tipe, debet, kredit, 
        sekolah: userData.sekolah,
        createdAt: serverTimestamp() 
      });
      document.getElementById('bkuFormModal').style.display = 'none';
      this.init(); // Recalculates dynamically
    } catch(e) {
      alert("Gagal menyimpan BKU: " + e.message);
    }
  },

  hapusData: async function(id) {
    if(!confirm("Yakin menghapus transaksi BKU ini? Menghapus transaksi masa lampau akan mempengaruhi konstelasi seluruh Saldo berjalan selamanya.")) return;
    try {
      const { doc, deleteDoc } = window._fb;
      await deleteDoc(doc(db, 'bku', id));
      this.init();
    } catch(e) { alert("Gagal hapus: " + e.message); }
  }
};
