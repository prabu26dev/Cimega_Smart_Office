window.ModulPTK = {
  container: null,
  gridInstance: null,
  ptkData: [],

  init: async function() {
    this.container = document.getElementById('modulePtkApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner" style="border-top-color:var(--cyan);width:30px;height:30px"></div><div style="margin-top:14px;color:var(--muted)">Menarik Data PTK...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where } = window._fb;
      const q = query(collection(db, 'ptk'), where('sekolah', '==', userData.sekolah || ''));
      const snap = await getDocs(q);
      
      this.ptkData = [];
      snap.forEach(doc => {
        this.ptkData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat PTK:", e);
    }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">👨‍🏫 MANAJEMEN PENDIDIK & TENAGA KEPENDIDIKAN (PTK)</div>
          <div>
            <button class="btn btn-success" onclick="window.ModulPTK.showForm()">+ Tambah PTK</button>
          </div>
        </div>
        <div class="card-body">
          <div id="gridWrapperPtk"></div>
        </div>
      </div>

      <!-- FORM ADD/EDIT PTK -->
      <div id="ptkFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:800px; max-height:90vh; overflow-y:auto; border-color:var(--cyan);">
          <div class="card-header">
            <div class="card-title" id="ptkFormTitle">Tambah PTK Baru</div>
            <button class="btn btn-ghost" onclick="document.getElementById('ptkFormModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            <input type="hidden" id="ptkId" />
            
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Nama Lengkap & Gelar</label><input class="form-control" id="ptkNama"/></div>
              <div class="form-group"><label class="form-label">NIK</label><input class="form-control" id="ptkNik"/></div>
            </div>
            
            <div class="grid-2">
              <div class="form-group"><label class="form-label">NUPTK</label><input class="form-control" id="ptkNuptk"/></div>
              <div class="form-group"><label class="form-label">Tempat, Tanggal Lahir</label><input class="form-control" id="ptkTtl" placeholder="Contoh: Bandung, 1990-05-15" /></div>
            </div>

            <div class="grid-3">
              <div class="form-group">
                <label class="form-label">Status Kepegawaian</label>
                <select class="form-control" id="ptkStatus">
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="GTY/PTY">GTY / PTY</option>
                  <option value="Honorer">Honorer Tingkat I</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Golongan/Ruang</label>
                <input class="form-control" id="ptkGolongan" placeholder="III/a" />
              </div>
              <div class="form-group">
                <label class="form-label">Tugas Utama</label>
                <input class="form-control" id="ptkTugas" placeholder="Guru Kelas 1A" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Link Arsip Digital (G-Drive SK / Ijazah)</label>
              <input class="form-control" id="ptkArsip" type="url" placeholder="https://drive.google.com/..." />
            </div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; margin-top:20px;" onclick="window.ModulPTK.saveData()">💾 Simpan Data PTK</button>
          </div>
        </div>
      </div>
    `;
  },

  initGrid: function() {
    const data = this.ptkData.map((s, idx) => [
      idx + 1,
      s.nuptk || '-',
      s.name || '-',
      s.status || '-',
      s.golongan || '-',
      s.tugas_utama || '-',
      gridjs.html(s.arsip ? \`<a href="\${s.arsip}" target="_blank" style="color:var(--cyan);">Lihat Arsip</a>\` : '-'),
      gridjs.html(\`<button class='btn btn-ghost btn-sm' onclick='window.ModulPTK.hapusData("\${s.id}")'>Hapus</button>\`)
    ]);

    this.gridInstance = new gridjs.Grid({
      columns: ['No', 'NUPTK', 'Nama Lengkap', 'Status Kepegawaian', 'Golongan', 'Tugas Utama', 'Arsip Digital', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      sort: true,
      language: {
        search: { placeholder: 'Cari PTK...' },
        pagination: { previous: 'Prev', next: 'Next', showing: 'Menampilkan', results: () => 'PTK' }
      }
    }).render(document.getElementById('gridWrapperPtk'));
  },

  showForm: function() {
    document.getElementById('ptkId').value = '';
    ['ptkNama','ptkNik','ptkNuptk','ptkTtl','ptkGolongan','ptkTugas','ptkArsip'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('ptkStatus').value = 'PNS';
    document.getElementById('ptkFormModal').style.display = 'flex';
  },

  saveData: async function() {
    const data = {
      name: document.getElementById('ptkNama').value.trim(),
      nik: document.getElementById('ptkNik').value.trim(),
      nuptk: document.getElementById('ptkNuptk').value.trim(),
      ttl: document.getElementById('ptkTtl').value.trim(),
      status: document.getElementById('ptkStatus').value,
      golongan: document.getElementById('ptkGolongan').value.trim(),
      tugas_utama: document.getElementById('ptkTugas').value.trim(),
      arsip: document.getElementById('ptkArsip').value.trim(),
      sekolah: userData.sekolah
    };

    if(!data.name) { alert("Nama wajib diisi!"); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'ptk'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('ptkFormModal').style.display = 'none';
      alert('Berhasil menyimpan data PTK.');
      this.init(); // Reload
    } catch(e) {
      alert("Gagal menyimpan: " + e.message);
    }
  },

  hapusData: async function(id) {
    if(!confirm("Yakin menghapus data PTK ini?")) return;
    try {
      const { doc, deleteDoc } = window._fb;
      await deleteDoc(doc(db, 'ptk', id));
      this.init();
    } catch(e) { alert("Gagal hapus: " + e.message); }
  }
};
