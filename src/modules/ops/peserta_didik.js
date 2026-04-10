window.ModulPD = {
  container: null,
  gridInstance: null,
  students: [],

  init: async function() {
    this.container = document.getElementById('modulePesertaDidikApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner" style="border-top-color:var(--cyan);width:30px;height:30px"></div><div style="margin-top:14px;color:var(--muted)">Menarik Data Peserta Didik...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where } = window._fb;
      // Because OPS might manage a specific school, we assume OPS sees their own school's data
      const q = query(collection(db, 'students'), where('sekolah', '==', userData.sekolah || ''));
      const snap = await getDocs(q);
      
      this.students = [];
      snap.forEach(doc => {
        this.students.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat students:", e);
    }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📖 BUKU INDUK PESERTA DIDIK</div>
          <div>
            <button class="btn btn-ghost" onclick="window.ModulPD.downloadCsvTemplate()">📥 Template Dapodik</button>
            <label class="btn btn-primary" style="margin-left:8px; cursor:pointer;">
              📤 Import CSV
              <input type="file" id="importCsv" accept=".csv" style="display:none;" onchange="window.ModulPD.handleImport(event)"/>
            </label>
            <button class="btn btn-success" style="margin-left:8px;" onclick="window.ModulPD.showForm()">+ Tambah Siswa</button>
          </div>
        </div>
        <div class="card-body">
          <div id="gridWrapper"></div>
        </div>
      </div>

      <!-- FORM ADD/EDIT -->
      <div id="pdFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:800px; max-height:90vh; overflow-y:auto; border-color:var(--cyan);">
          <div class="card-header">
            <div class="card-title" id="pdFormTitle">Tambah Peserta Didik Baru</div>
            <button class="btn btn-ghost" onclick="document.getElementById('pdFormModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            <input type="hidden" id="pdId" />
            <div class="section-title">Data <span>Pribadi</span></div>
            <div class="grid-3">
              <div class="form-group"><label class="form-label">NISN</label><input class="form-control" id="pdNisn"/></div>
              <div class="form-group"><label class="form-label">NIS</label><input class="form-control" id="pdNis"/></div>
              <div class="form-group"><label class="form-label">NIK</label><input class="form-control" id="pdNik"/></div>
            </div>
            <div class="form-group"><label class="form-label">Nama Lengkap</label><input class="form-control" id="pdNama"/></div>
            
            <div class="grid-3">
              <div class="form-group"><label class="form-label">Tempat Lahir</label><input class="form-control" id="pdTempat"/></div>
              <div class="form-group"><label class="form-label">Tanggal Lahir</label><input class="form-control" type="date" id="pdTgl"/></div>
              <div class="form-group">
                <label class="form-label">Jenis Kelamin</label>
                <select class="form-control" id="pdKelamin"><option value="L">L</option><option value="P">P</option></select>
              </div>
            </div>

            <div class="section-title">Data <span>Keluarga & Alamat</span></div>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Nama Ibu Kandung</label><input class="form-control" id="pdIbu"/></div>
              <div class="form-group"><label class="form-label">Nama Ayah</label><input class="form-control" id="pdAyah"/></div>
            </div>
            <div class="form-group"><label class="form-label">Alamat Lengkap (Jalan, RT/RW, Kode Pos)</label><textarea class="form-control" id="pdAlamat"></textarea></div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; margin-top:20px;" onclick="window.ModulPD.saveSiswa()">💾 Simpan Ke Database</button>
          </div>
        </div>
      </div>
    `;
  },

  initGrid: function() {
    const data = this.students.map((s, idx) => [
      idx + 1,
      s.nisn || '-',
      s.nis || '-',
      s.name || '-',
      s.gender || '-',
      s.tempat_lahir ? \`\${s.tempat_lahir}, \${s.tanggal_lahir}\` : '-',
      s.nama_ibu || '-',
      gridjs.html(\`<button class='btn btn-ghost btn-sm' onclick='window.ModulPD.hapusSiswa("\${s.id}")'>Hapus</button>\`)
    ]);

    this.gridInstance = new gridjs.Grid({
      columns: ['No', 'NISN', 'NIS', 'Nama Lengkap', 'L/P', 'TTL', 'Nama Ibu', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      sort: true,
      language: {
        search: { placeholder: 'Cari siswa...' },
        pagination: { previous: 'Prev', next: 'Next', showing: 'Menampilkan', results: () => 'Siswa' }
      }
    }).render(document.getElementById('gridWrapper'));
  },

  showForm: function() {
    document.getElementById('pdId').value = '';
    ['pdNisn','pdNis','pdNik','pdNama','pdTempat','pdTgl','pdIbu','pdAyah','pdAlamat'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('pdKelamin').value = 'L';
    document.getElementById('pdFormModal').style.display = 'flex';
  },

  saveSiswa: async function() {
    const data = {
      nisn: document.getElementById('pdNisn').value.trim(),
      nis: document.getElementById('pdNis').value.trim(),
      nik: document.getElementById('pdNik').value.trim(),
      name: document.getElementById('pdNama').value.trim(),
      tempat_lahir: document.getElementById('pdTempat').value.trim(),
      tanggal_lahir: document.getElementById('pdTgl').value.trim(),
      gender: document.getElementById('pdKelamin').value,
      nama_ibu: document.getElementById('pdIbu').value.trim(),
      nama_ayah: document.getElementById('pdAyah').value.trim(),
      alamat: document.getElementById('pdAlamat').value.trim(),
      sekolah: userData.sekolah
    };

    if(!data.name || !data.nisn) { alert("Nama dan NISN wajib diisi!"); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'students'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('pdFormModal').style.display = 'none';
      alert('Berhasil menyimpan data siswa.');
      this.init(); // Reload
    } catch(e) {
      alert("Gagal menyimpan: " + e.message);
    }
  },

  hapusSiswa: async function(id) {
    if(!confirm("Yakin menghapus siswa ini secara permanen?")) return;
    try {
      const { doc, deleteDoc } = window._fb;
      await deleteDoc(doc(db, 'students', id));
      this.init();
    } catch(e) { alert("Gagal hapus: " + e.message); }
  },

  downloadCsvTemplate: function() {
    // Dapodik Headers requested by user
    const headers = [
      "Nama", "NISN", "NIS", "NIK", "Tempat Lahir", "Tanggal Lahir", "Jenis Kelamin", "Nama Ibu Kandung", "Nama Ayah", "Alamat"
    ];
    // Example Data Row
    const data = [
      headers,
      ["Budi Santoso", "0012345678", "101", "3201234567890001", "Jakarta", "2010-05-12", "L", "Siti", "Andi", "Jl. Mawar No. 12 RT 01 RW 01"]
    ];

    const csvContent = Papa.unparse(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Impor_PesertaDidik.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  handleImport: function(event) {
    const file = event.target.files[0];
    if(!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        if(rows.length === 0) return alert("CSV Kosong!");
        
        let success = 0;
        const { collection, addDoc, serverTimestamp } = window._fb;
        const colRef = collection(db, 'students');

        // Parse corresponding to Dapodik Headers
        for(let row of rows) {
          if(!row["Nama"] || !row["NISN"]) continue; // skip invalid rows
          try {
            await addDoc(colRef, {
              name: row["Nama"],
              nisn: row["NISN"],
              nis: row["NIS"] || "",
              nik: row["NIK"] || "",
              tempat_lahir: row["Tempat Lahir"] || "",
              tanggal_lahir: row["Tanggal Lahir"] || "",
              gender: row["Jenis Kelamin"] || "L",
              nama_ibu: row["Nama Ibu Kandung"] || "",
              nama_ayah: row["Nama Ayah"] || "",
              alamat: row["Alamat"] || "",
              sekolah: userData.sekolah,
              createdAt: serverTimestamp()
            });
            success++;
          } catch(e) {
            console.error("Failed to insert row", row, e);
          }
        }
        
        document.getElementById('importCsv').value = ""; // reset
        alert(\`Import Selesai! Berhasil mengimpor \${success} data siswa.\`);
        this.init(); // Reload
      }
    });
  }
};
