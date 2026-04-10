window.ModulSupervisi = {
  container: null,
  supervisiData: [],
  userData: null,

  init: async function() {
    this.container = document.getElementById('moduleSupervisiApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner-glowing"></div><div style="margin-top:14px;color:var(--muted)">Menarik Data Supervisi...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const schoolId = this.userData.school_id || 'NPSN_MIGRATE';
      
      const q = query(
        collection(db, 'supervisi'), 
        where('school_id', '==', schoolId), 
        orderBy('tanggal', 'desc')
      );
      const snap = await getDocs(q);
      
      this.supervisiData = [];
      snap.forEach(doc => {
        this.supervisiData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) { console.error("Gagal memuat supervisi:", e); }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">🔍 INSTRUMEN SUPERVISI AKADEMIK GURU</div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-ghost" onclick="window.ModulSupervisi.showAIReport()">🤖 Generate Laporan Evaluasi (AI)</button>
            <button class="btn btn-primary" onclick="window.ModulSupervisi.showForm()">📝 Form Observasi Baru</button>
          </div>
        </div>
        <div class="card-body" id="gridWrapperSupervisi"></div>
      </div>

      <!-- FORM OBSERVASI -->
      <div id="supervisiFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999; align-items:center; justify-content:center; backdrop-filter:blur(10px);">
        <div class="card" style="width:100%; max-width:600px; max-height:90vh; overflow-y:auto; border-color:var(--violet-light);">
          <div class="card-header">
            <div class="card-title">Lembar Observasi Kelas</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('supervisiFormModal').style.display='none'">✕</button>
          </div>
          <div class="card-body">
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Tanggal</label><input type="date" class="form-control" id="svTgl" /></div>
              <div class="form-group"><label class="form-label">Nama Guru</label><input class="form-control" id="svGuru" placeholder="Contoh: Budi Santoso, S.Pd" /></div>
            </div>
            <div class="form-group"><label class="form-label">Mata Pelajaran / Kelas</label><input class="form-control" id="svMapel" placeholder="Matematika Kelas 4A" /></div>
            <div style="background:rgba(157,78,221,0.05); padding:15px; border-radius:8px; border:1px solid var(--border); margin-bottom:15px;">
              <div style="font-size:10px; color:var(--muted); text-transform:uppercase; margin-bottom:10px;">Rubrik Penilaian (Skor 1 - 4)</div>
              <div class="form-group" style="margin-bottom:10px;">
                <label class="form-label">1. Aspek Perencanaan</label>
                <select class="form-control" id="svPerencanaan">
                   <option value="1">1 - Kurang</option><option value="2">2 - Cukup</option><option value="3">3 - Baik</option><option value="4" selected>4 - Sangat Baik</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">2. Aspek Pelaksanaan (KBM)</label>
                <select class="form-control" id="svPelaksanaan">
                   <option value="1">1 - Kurang</option><option value="2">2 - Cukup</option><option value="3">3 - Baik</option><option value="4" selected>4 - Sangat Baik</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Catatan Refleksi</label><textarea class="form-control" id="svCatatan" placeholder="Catatan asessor..." style="height:80px;"></textarea></div>
            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="window.ModulSupervisi.saveData()">💾 Simpan Observasi</button>
          </div>
        </div>
      </div>

      <!-- MODAL AI REPORT -->
      <div id="aiReportModal" style="display:none; position:fixed; inset:0; background:rgba(2, 11, 24, 0.9); z-index:9999; align-items:center; justify-content:center; backdrop-filter:blur(10px);">
        <div class="card" style="width:100%; max-width:800px; max-height:90vh; overflow-y:auto; border-color:var(--success);">
          <div class="card-header" style="background:rgba(0,255,136,0.1);">
            <div class="card-title" style="color:var(--success);">🤖 LAPORAN EVALUASI (AI ASSESSOR)</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('aiReportModal').style.display='none'">✕</button>
          </div>
          <div class="card-body">
            <div id="aiContentArea"></div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('svTgl').value = new Date().toISOString().split('T')[0];
  },

  initGrid: function() {
    const data = this.supervisiData.map((s, idx) => [
      s.tanggal || '-',
      s.nama_guru || '-',
      s.mapel || '-',
      s.skor_perencanaan || '-',
      s.skor_pelaksanaan || '-',
      gridjs.html(`<button class='btn btn-ghost btn-sm' onclick='showToast("info","Catatan","${(s.catatan || '').replace(/"/g,"'")}")'>Catatan</button> <button class='btn btn-danger btn-sm' onclick='window.ModulSupervisi.hapusData("${s.id}")'>🗑</button>`)
    ]);

    const wrapper = document.getElementById('gridWrapperSupervisi');
    wrapper.innerHTML = '';
    new gridjs.Grid({
      columns: ['Tanggal', 'Guru', 'Mapel', 'RPP', 'KBM', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 }
    }).render(wrapper);
  },

  showForm: function() {
    document.getElementById('svGuru').value = '';
    document.getElementById('svMapel').value = '';
    document.getElementById('svCatatan').value = '';
    document.getElementById('supervisiFormModal').style.display = 'flex';
  },

  saveData: async function() {
    const data = {
      tanggal: document.getElementById('svTgl').value,
      nama_guru: document.getElementById('svGuru').value.trim(),
      mapel: document.getElementById('svMapel').value.trim(),
      skor_perencanaan: parseInt(document.getElementById('svPerencanaan').value),
      skor_pelaksanaan: parseInt(document.getElementById('svPelaksanaan').value),
      catatan: document.getElementById('svCatatan').value.trim(),
      sekolah: this.userData.sekolah,
      school_id: this.userData.school_id || 'NPSN_MIGRATE'
    };

    if(!data.nama_guru || !data.mapel) { showToast('warn', 'Perhatian', 'Nama guru dan Mapel wajib diisi!'); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'supervisi'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('supervisiFormModal').style.display = 'none';
      showToast('success', 'Berhasil', 'Data observasi disimpan.');
      this.init(); 
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  hapusData: async function(id) {
    if(!confirm("Yakin menghapus rekam medis observasi ini?")) return;
    try { 
      const { doc, deleteDoc } = window._fb; 
      await deleteDoc(doc(db, 'supervisi', id)); 
      showToast('success', 'Dihapus', 'Data supervisi berhasil dihapus.');
      this.init(); 
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  showAIReport: async function() {
    if(this.supervisiData.length === 0) return showToast('warn', 'Gagal', 'Belum ada data supervisi!');
    
    document.getElementById('aiReportModal').style.display = 'flex';
    document.getElementById('aiContentArea').innerHTML = `
      <div style="text-align:center; padding:40px;">
        <div class="spinner-glowing" style="margin:0 auto 20px;"></div>
        <div style="color:var(--success); font-family:'Orbitron',sans-serif;">Cimega AI sedang menyusun Laporan Evaluasi...</div>
      </div>
    `;

    try {
      const dbContext = this.supervisiData.map(s => `Guru: ${s.nama_guru}, Perencanaan: ${s.skor_perencanaan}/4, KBM: ${s.skor_pelaksanaan}/4. Catatan: ${s.catatan}`).join('\\n');
      const systemPrompt = `Analyze supervision reports for Kurikulum Merdeka and provide a professional evaluation. Use HTML structure.`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Data:\n${dbContext}` }]
      });

      if(res.error) throw new Error(res.error);
      document.getElementById('aiContentArea').innerHTML = res.text.replace(/```html/g, '').replace(/```/g, '');
    } catch(e) {
      document.getElementById('aiContentArea').innerHTML = `<div style="color:var(--danger)">Error: ${e.message}</div>`;
    }
  }
};
