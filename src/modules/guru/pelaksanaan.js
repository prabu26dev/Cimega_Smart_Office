window.ModulPelaksanaan = {
  container: null,
  students: [],

  init: async function() {
    this.container = document.getElementById('modulPelaksanaanApp');
    this.renderSkeleton();
    await this.loadStudents();
    this.render();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:40px;"><div class="spinner"></div><div style="margin-top:10px;color:var(--muted)">Memuat data siswa...</div></div>`;
  },

  loadStudents: async function() {
    try {
      const { collection, getDocs, query, where } = window._fb;
      // We assume the teacher manages students in their own school. Ideally, it should filter by 'classId'.
      const snap = await getDocs(query(collection(db, 'students'), where('sekolah', '==', userData.sekolah)));
      this.students = [];
      snap.forEach(doc => {
        this.students.push({ id: doc.id, ...doc.data() });
      });
      // Sort alphabetically
      this.students.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    } catch(e) {
      console.error("Gagal memuat siswa:", e);
    }
  },

  render: function() {
    let studentRows = this.students.map((s, idx) => `
      <tr>
        <td style="text-align:center;">${idx+1}</td>
        <td>${s.nis || '-'}</td>
        <td style="font-weight:600;">${s.name || '-'}</td>
        <td>${s.gender==='L'?'Laki-laki':'Perempuan'}</td>
        <td>
          <select class="form-control" style="padding:4px;" id="presensi_${s.id}">
            <option value="Hadir">Hadir</option>
            <option value="Sakit">Sakit</option>
            <option value="Izin">Izin</option>
            <option value="Alpa">Alpa</option>
          </select>
        </td>
      </tr>
    `).join('');

    if(this.students.length === 0) {
      studentRows = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">Belum ada siswa di kelas Anda. Hubungi OPS untuk memasukkan data siswa.</td></tr>`;
    }

    const today = new Date().toISOString().split('T')[0];

    this.container.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">📝 JURNAL MENGAJAR HARIAN</div>
        </div>
        <div class="card-body">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tanggal</label>
              <input class="form-control" type="date" id="jurnalTanggal" value="${today}" />
            </div>
            <div class="form-group">
              <label class="form-label">Mata Pelajaran</label>
              <input class="form-control" id="jurnalMapel" placeholder="Contoh: IPAS" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Materi / Topik</label>
            <input class="form-control" id="jurnalMateri" placeholder="Topik yang diajarkan hari ini" />
          </div>
          <div class="form-group">
            <label class="form-label">Catatan / Jurnal Anekdotal</label>
            <textarea class="form-control" id="jurnalAnekdotal" placeholder="Catatan perilaku siswa atau kejadian penting hari ini..."></textarea>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🙋‍♂️ PRESENSI SISWA</div>
          <button class="btn btn-primary btn-sm" onclick="window.ModulPelaksanaan.simpanPelaksanaan()">💾 Simpan Jurnal & Presensi</button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrap" style="border:none; border-radius:0;">
            <table>
              <thead>
                <tr>
                  <th style="width:50px;text-align:center;">No</th>
                  <th>NIS</th>
                  <th>Nama Siswa</th>
                  <th>L/P</th>
                  <th style="width:150px;">Status Presensi</th>
                </tr>
              </thead>
              <tbody>
                ${studentRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  simpanPelaksanaan: async function() {
    const tanggal = document.getElementById('jurnalTanggal').value;
    const mapel = document.getElementById('jurnalMapel').value.trim();
    const materi = document.getElementById('jurnalMateri').value.trim();
    const anekdotal = document.getElementById('jurnalAnekdotal').value.trim();

    if(!tanggal || !mapel || !materi) {
      showToast('warn', 'Perhatian', 'Tanggal, Mapel, dan Materi wajib diisi!');
      return;
    }

    const presensiData = {};
    this.students.forEach(s => {
      const select = document.getElementById('presensi_'+s.id);
      if(select) presensiData[s.id] = select.value;
    });

    const { collection, addDoc, serverTimestamp } = window._fb;
    
    try {
      await addDoc(collection(db, 'pelaksanaan_harian'), {
        sekolah: userData.sekolah,
        guruId: userData.id,
        guruName: userData.nama,
        tanggal: tanggal,
        mapel: mapel,
        materi: materi,
        anekdotal: anekdotal,
        presensi: presensiData,
        createdAt: serverTimestamp()
      });

      showToast('success', 'Tersimpan', 'Jurnal dan Presensi hari ini berhasil disimpan.');
      
      // Reset sedikit UI
      document.getElementById('jurnalMateri').value = '';
      document.getElementById('jurnalAnekdotal').value = '';

    } catch (e) {
      showToast('error', 'Gagal', 'Terjadi kesalahan: ' + e.message);
    }
  }
};
