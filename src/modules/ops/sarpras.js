window.ModulSarpras = {
  container: null,
  ruanganData: [],
  inventarisData: [],

  init: async function() {
    this.container = document.getElementById('moduleSarprasApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGridRuang();
    this.initGridInventaris();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner" style="border-top-color:var(--cyan);width:30px;height:30px"></div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where } = window._fb;
      const qRuang = query(collection(db, 'ruangan'), where('sekolah', '==', userData.sekolah || ''));
      const snapRuang = await getDocs(qRuang);
      
      this.ruanganData = [];
      snapRuang.forEach(doc => {
        this.ruanganData.push({ id: doc.id, ...doc.data() });
      });

      const qInv = query(collection(db, 'inventaris'), where('sekolah', '==', userData.sekolah || ''));
      const snapInv = await getDocs(qInv);
      
      this.inventarisData = [];
      snapInv.forEach(doc => {
        this.inventarisData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat Sarpras:", e);
    }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">🏫 MANAJEMEN RUANGAN</div>
            <button class="btn btn-success btn-sm" onclick="window.ModulSarpras.showRuanganForm()">+ Ruangan</button>
          </div>
          <div class="card-body">
            <div id="gridWrapperRuang"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🗄️ INVENTARIS BARANG (KIR)</div>
            <button class="btn btn-primary btn-sm" onclick="window.ModulSarpras.showInventarisForm()">+ Barang</button>
          </div>
          <div class="card-body">
            <div id="gridWrapperInventaris"></div>
          </div>
        </div>
      </div>

      <!-- FORM RUANGAN -->
      <div id="ruangModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:400px; border-color:var(--cyan);">
          <div class="card-header">
            <div class="card-title">Tambah Ruangan</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('ruangModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            <div class="form-group"><label class="form-label">Nama Ruangan</label><input class="form-control" id="rNama" placeholder="Contoh: Kelas 1A" /></div>
            <div class="form-group"><label class="form-label">Kapasitas (Orang)</label><input type="number" class="form-control" id="rKapasitas"/></div>
            <div class="form-group">
              <label class="form-label">Kondisi Ruangan</label>
              <select class="form-control" id="rKondisi">
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
            <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:10px;" onclick="window.ModulSarpras.saveRuangan()">Simpan Ruangan</button>
          </div>
        </div>
      </div>

      <!-- FORM INVENTARIS -->
      <div id="invModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:500px; border-color:var(--cyan);">
          <div class="card-header">
            <div class="card-title">Tambah Inventaris Barang</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('invModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Kode Barang</label><input class="form-control" id="iKode"/></div>
              <div class="form-group"><label class="form-label">Nama Barang</label><input class="form-control" id="iNama"/></div>
            </div>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Merk / Spesifikasi</label><input class="form-control" id="iMerk"/></div>
              <div class="form-group"><label class="form-label">Tahun Pengadaan</label><input class="form-control" type="number" id="iTahun"/></div>
            </div>
            <div class="grid-3">
              <div class="form-group"><label class="form-label">Jumlah</label><input class="form-control" type="number" id="iJumlah"/></div>
              <div class="form-group">
                <label class="form-label">Kondisi</label>
                <select class="form-control" id="iKondisi"><option value="Baik">Baik</option><option value="Rusak Ringan">Rusak Ringan</option><option value="Rusak Berat">Rusak Berat</option></select>
              </div>
              <div class="form-group">
                <label class="form-label">Sumber Dana</label>
                <select class="form-control" id="iDana"><option value="BOSP">BOSP</option><option value="Yayasan">Yayasan</option><option value="Bantuan/Lainnya">Lainnya</option></select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Alokasi Ruangan</label>
              <select class="form-control" id="iRuang">
                ${this.ruanganData.map(r => '<option value="' + r.id + '">' + r.nama + '</option>').join('')}
              </select>
            </div>
            <button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:10px;" onclick="window.ModulSarpras.saveInventaris()">Simpan Inventaris</button>
          </div>
        </div>
      </div>
    `;
  },

  initGridRuang: function() {
    const data = this.ruanganData.map((r, idx) => [
      r.nama || '-', r.kapasitas || '-', r.kondisi || '-',
      gridjs.html("<button class='btn btn-ghost btn-sm' onclick='window.ModulSarpras.hapusRuang(\"" + r.id + "\")'>Hapus</button>")
    ]);

    new gridjs.Grid({
      columns: ['Ruangan', 'Kapasitas', 'Kondisi', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 5 },
      language: { search: { placeholder: 'Cari Ruang...' } }
    }).render(document.getElementById('gridWrapperRuang'));
  },

  initGridInventaris: function() {
    const data = this.inventarisData.map((i, idx) => {
      const ruang = this.ruanganData.find(r => r.id === i.ruangId);
      return [
        i.kode || '-',
        i.nama || '-',
        i.jumlah || '-',
        i.kondisi || '-',
        ruang ? ruang.nama : '-',
        gridjs.html("<button class='btn btn-ghost btn-sm' onclick='window.ModulSarpras.hapusInventaris(\"" + i.id + "\")'>Hapus</button>")
      ];
    });

    new gridjs.Grid({
      columns: ['Kode', 'Barang', 'Jml', 'Kondisi', 'Ruang', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      sort: true,
      language: { search: { placeholder: 'Cari Barang...' } }
    }).render(document.getElementById('gridWrapperInventaris'));
  },

  showRuanganForm: function() { document.getElementById('ruangModal').style.display='flex'; },
  showInventarisForm: function() { 
    if(this.ruanganData.length === 0) { alert("Tambahkan Ruangan terlebih dahulu!"); return; }
    document.getElementById('invModal').style.display='flex'; 
  },

  saveRuangan: async function() {
    const data = {
      nama: document.getElementById('rNama').value.trim(),
      kapasitas: document.getElementById('rKapasitas').value,
      kondisi: document.getElementById('rKondisi').value,
      sekolah: userData.sekolah
    };
    if(!data.nama) return alert("Nama ruangan wajib diisi");

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'ruangan'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('ruangModal').style.display = 'none';
      this.init();
    } catch(e) { alert(e.message); }
  },

  saveInventaris: async function() {
    const data = {
      kode: document.getElementById('iKode').value.trim(),
      nama: document.getElementById('iNama').value.trim(),
      merk: document.getElementById('iMerk').value.trim(),
      tahun: document.getElementById('iTahun').value,
      jumlah: document.getElementById('iJumlah').value,
      kondisi: document.getElementById('iKondisi').value,
      sumber_dana: document.getElementById('iDana').value,
      ruangId: document.getElementById('iRuang').value,
      sekolah: userData.sekolah
    };
    if(!data.nama) return alert("Nama barang wajib diisi");

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'inventaris'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('invModal').style.display = 'none';
      this.init();
    } catch(e) { alert(e.message); }
  },

  hapusRuang: async function(id) {
    if(!confirm("Menghapus ruangan tidak akan menghapus barang di dalamnya. Lanjutkan?")) return;
    try { const { doc, deleteDoc } = window._fb; await deleteDoc(doc(db, 'ruangan', id)); this.init(); } catch(e) { alert(e.message); }
  },
  hapusInventaris: async function(id) {
    if(!confirm("Yakin menghapus barang ini?")) return;
    try { const { doc, deleteDoc } = window._fb; await deleteDoc(doc(db, 'inventaris', id)); this.init(); } catch(e) { alert(e.message); }
  }
};
