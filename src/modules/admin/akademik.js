window.AdminAkademik = {
  container: null,
  academicYears: [],
  students: [],

  init: async function() {
    this.container = document.getElementById('adminAkademikApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner"></div><div style="margin-top:10px;color:var(--muted)">Memuat Data Akademik...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, orderBy } = window._fb;
      
      this.academicYears = [];
      try {
        const snapTahun = await getDocs(query(collection(db, 'academic_years'), orderBy('name', 'desc')));
        snapTahun.forEach(doc => this.academicYears.push({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn("Tahun akademik collection may not exist yet or missing index");
      }

      this.students = [];
      try {
        const snapSiswa = await getDocs(collection(db, 'students'));
        snapSiswa.forEach(doc => this.students.push({ id: doc.id, ...doc.data() }));
        this.students.sort((a,b) => (a.name||'').localeCompare(b.name||''));
      } catch (e) {
        console.warn("Students collection may not exist yet");
      }
    } catch(e) {
      console.error("Gagal memuat data akademik:", e);
    }
  },

  render: function() {
    let tahunRows = this.academicYears.map(t => `
      <tr>
        <td style="font-weight:600">${t.name}</td>
        <td>${t.semester}</td>
        <td><span class="badge badge-${t.isActive ? 'active' : 'inactive'}">${t.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
        <td>
          ${!t.isActive ? `<button class="btn btn-sm btn-success" onclick="window.AdminAkademik.setTahunAktif('${t.id}')">Set Aktif</button>` : `<span style="color:var(--success);font-size:10px;">Berjalan</span>`}
        </td>
      </tr>
    `).join('');
    if(this.academicYears.length === 0) tahunRows = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">Belum ada data Tahun Akademik</td></tr>`;

    let studentRows = this.students.map((s, i) => `
      <tr>
        <td>${i+1}</td>
        <td>${s.nisn || '-'}</td>
        <td>${s.nis || '-'}</td>
        <td style="font-weight:600">${s.name || '-'}</td>
        <td>${s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
        <td>${s.sekolah || '-'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="window.AdminAkademik.hapusSiswa('${s.id}')">Hapus</button>
        </td>
      </tr>
    `).join('');
    if(this.students.length === 0) studentRows = `<tr><td colspan="7" style="text-align:center;color:var(--muted)">Belum ada data Siswa</td></tr>`;

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title">Manajemen <span>Tahun Akademik</span></div>
      </div>
      <div class="card" style="margin-bottom:20px;">
        <div class="card-body">
          <div style="display:flex;gap:10px;margin-bottom:14px;align-items:flex-end;">
            <div class="form-group" style="margin:0;flex:1;">
               <label class="form-label">Tahun (Cth: 2026/2027)</label>
               <input class="form-control" id="akTahun" />
            </div>
            <div class="form-group" style="margin:0;flex:1;">
               <label class="form-label">Semester</label>
               <select class="form-control" id="akSemester">
                 <option value="Ganjil">Ganjil</option>
                 <option value="Genap">Genap</option>
               </select>
            </div>
            <button class="btn btn-primary" onclick="window.AdminAkademik.tambahTahun()">+ Tambah</button>
          </div>
          <div class="table-wrap" style="border:none;">
            <table>
              <thead><tr><th>Tahun Akademik</th><th>Semester</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>${tahunRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">Master Data <span>Siswa</span></div>
      </div>
      <div class="card">
        <div class="card-body">
          <div style="background:rgba(0,229,255,0.03); border:1px solid rgba(0,229,255,0.1); padding:14px; border-radius:8px; margin-bottom:14px;">
            <div style="font-family:'Orbitron',sans-serif;font-size:11px;color:var(--cyan);margin-bottom:10px">TAMBAH SISWA BARU</div>
            <div class="grid-4" style="align-items:flex-end;">
               <div class="form-group" style="margin:0;">
                 <label class="form-label">NISN</label><input class="form-control" id="swNisn" />
               </div>
               <div class="form-group" style="margin:0;">
                 <label class="form-label">NIS Local</label><input class="form-control" id="swNis" />
               </div>
               <div class="form-group" style="margin:0;">
                 <label class="form-label">Nama Lengkap</label><input class="form-control" id="swNama" />
               </div>
               <div class="form-group" style="margin:0;">
                 <label class="form-label">L/P</label>
                 <select class="form-control" id="swGender"><option value="L">L</option><option value="P">P</option></select>
               </div>
            </div>
            <div style="margin-top:10px; display:flex; gap:10px; align-items:flex-end;">
               <div class="form-group" style="margin:0; flex:1;">
                 <label class="form-label">Sekolah (Alokasi)</label><input class="form-control" id="swSekolah" placeholder="Contoh: SDN Cimega" />
               </div>
               <button class="btn btn-success" onclick="window.AdminAkademik.tambahSiswa()">💾 Simpan Data Siswa</button>
            </div>
          </div>
          <div class="table-wrap" style="border:none;">
            <table>
              <thead><tr><th style="width:40px;">No</th><th>NISN</th><th>NIS</th><th>Nama Lengkap</th><th>L/P</th><th>Sekolah</th><th>Aksi</th></tr></thead>
              <tbody>${studentRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  tambahTahun: async function() {
    const name = document.getElementById('akTahun').value.trim();
    const semester = document.getElementById('akSemester').value;
    if(!name) { showToast('warn', 'Perhatian', 'Isi nama tahun akademik!'); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'academic_years'), {
        name,
        semester,
        isActive: false,
        createdAt: serverTimestamp()
      });
      showToast('success', 'Berhasil', 'Tahun Akademik disimpan.');
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  setTahunAktif: async function(id) {
    try {
      const { doc, updateDoc, writeBatch } = window._fb;
      const batch = writeBatch(db);
      this.academicYears.forEach(t => {
        const ref = doc(db, 'academic_years', t.id);
        if(t.id === id) batch.update(ref, { isActive: true });
        else if (t.isActive) batch.update(ref, { isActive: false });
      });
      await batch.commit();
      showToast('success', 'Berhasil', 'Tahun akademik aktif diubah.');
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  tambahSiswa: async function() {
    const nisn = document.getElementById('swNisn').value.trim();
    const nis = document.getElementById('swNis').value.trim();
    const name = document.getElementById('swNama').value.trim();
    const gender = document.getElementById('swGender').value;
    const sekolah = document.getElementById('swSekolah').value.trim();

    if(!name || !sekolah) { showToast('warn', 'Perhatian', 'Nama dan Sekolah wajib diisi!'); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'students'), {
        nisn, nis, name, gender, sekolah,
        createdAt: serverTimestamp()
      });
      showToast('success', 'Berhasil', 'Data siswa berhasil ditambahkan.');
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  hapusSiswa: async function(id) {
    if(!confirm("Yakin hapus siswa ini?")) return;
    try {
      const { doc, deleteDoc } = window._fb;
      await deleteDoc(doc(db, 'students', id));
      showToast('success', 'Dihapus', 'Data siswa dihapus.');
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  }
};
