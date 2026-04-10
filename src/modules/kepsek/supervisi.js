window.ModulSupervisi = {
  container: null,
  supervisiData: [],

  init: async function() {
    this.container = document.getElementById('moduleSupervisiApp');
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
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const q = query(collection(db, 'supervisi'), where('sekolah', '==', userData.sekolah || ''), orderBy('tanggal', 'desc'));
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
            <button class="btn btn-ghost" onclick="window.ModulSupervisi.showAIReport()"><span style="font-size:16px;">🤖</span> Generate Laporan Evaluasi (AI)</button>
            <button class="btn btn-primary" onclick="window.ModulSupervisi.showForm()">📝 Form Observasi Baru</button>
          </div>
        </div>
        <div class="card-body">
          <div id="gridWrapperSupervisi"></div>
        </div>
      </div>

      <!-- FORM OBSERVASI (TABLET RESPONSIVE) -->
      <div id="supervisiFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:600px; max-height:90vh; overflow-y:auto; border-color:var(--violet-light);">
          <div class="card-header">
            <div class="card-title">Lembar Observasi Kelas</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('supervisiFormModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Tanggal Pelaksanaan</label><input type="date" class="form-control" id="svTgl" /></div>
              <div class="form-group"><label class="form-label">Nama Guru</label><input class="form-control" id="svGuru" placeholder="Contoh: Budi Santoso, S.Pd" /></div>
            </div>
            
            <div class="form-group"><label class="form-label">Mata Pelajaran / Kelas</label><input class="form-control" id="svMapel" placeholder="Matematika Kelas 4A" /></div>

            <!-- RUBRIK PENILAIAN -->
            <div style="background:rgba(157,78,221,0.05); padding:15px; border-radius:8px; border:1px solid var(--border); margin-bottom:15px;">
              <div style="font-size:10px; color:var(--muted); text-transform:uppercase; margin-bottom:10px;">Rubrik Penilaian (Skor 1 - 4)</div>
              
              <div class="form-group" style="margin-bottom:10px;">
                <label class="form-label" style="color:var(--cyan);">1. Aspek Perencanaan (Kelengkapan Modul Ajar/RPP)</label>
                <select class="form-control" id="svPerencanaan">
                  <option value="1">1 - Kurang (Tidak Lengkap)</option>
                  <option value="2">2 - Cukup (Ada namun tidak terstruktur)</option>
                  <option value="3">3 - Baik (Lengkap & Terstruktur)</option>
                  <option value="4" selected>4 - Sangat Baik (Sesuai Kurikulum Merdeka & Berdiferensiasi)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="color:var(--cyan);">2. Aspek Pelaksanaan (Aktivitas Kelas & Penguasaan)</label>
                <select class="form-control" id="svPelaksanaan">
                  <option value="1">1 - Kurang (Berpusat pada guru 100%)</option>
                  <option value="2">2 - Cukup (Ada interaksi minimal)</option>
                  <option value="3">3 - Baik (Siswa aktif berpartisipasi)</option>
                  <option value="4" selected>4 - Sangat Baik (Pembelajaran Interaktif & HOTS)</option>
                </select>
              </div>
            </div>

            <div class="form-group"><label class="form-label">Catatan Refleksi / Pembinaan</label><textarea class="form-control" id="svCatatan" placeholder="Catatan asessor..." style="height:80px;"></textarea></div>

            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="window.ModulSupervisi.saveData()">💾 Simpan Observasi</button>
          </div>
        </div>
      </div>

      <!-- MODAL AI REPORT -->
      <div id="aiReportModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:800px; max-height:90vh; overflow-y:auto; border-color:var(--success);">
          <div class="card-header" style="background:rgba(0,255,136,0.1);">
            <div class="card-title" style="color:var(--success);">🤖 LAPORAN EVALUASI MAKRO (AI ASSESSOR)</div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('aiReportModal').style.display='none'">Tutup</button>
          </div>
          <div class="card-body">
            <div id="aiContentArea" style="line-height:1.6; color:var(--text); font-size:13px; font-family:Arial, sans-serif;">
              <div class="spinner-glowing" style="margin:40px auto;"></div>
              <div style="text-align:center; color:var(--success);">AI Sedang Menyusun Laporan Pendidikan Kurikulum Merdeka...</div>
            </div>
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
      gridjs.html(\`<button class='btn btn-ghost btn-sm' onclick='alert("Catatan: \${s.catatan || ""}")'>Catatan</button> <button class='btn btn-danger btn-sm' onclick='window.ModulSupervisi.hapusData("\${s.id}")'>Hapus</button>\`)
    ]);

    new gridjs.Grid({
      columns: ['Tanggal', 'Guru', 'Mapel/Kelas', 'Skor RPP', 'Skor KBM', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      language: { search: { placeholder: 'Cari Riwayat...' } }
    }).render(document.getElementById('gridWrapperSupervisi'));
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
      sekolah: userData.sekolah
    };

    if(!data.nama_guru || !data.mapel) { alert("Nama guru dan Mapel wajib diisi!"); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'supervisi'), { ...data, createdAt: serverTimestamp() });
      document.getElementById('supervisiFormModal').style.display = 'none';
      this.init(); // Reload Data
    } catch(e) { alert("Gagal menyimpan: " + e.message); }
  },

  hapusData: async function(id) {
    if(!confirm("Yakin menghapus rekam medis observasi kelas ini?")) return;
    try { const { doc, deleteDoc } = window._fb; await deleteDoc(doc(db, 'supervisi', id)); this.init(); } catch(e) { alert(e.message); }
  },

  showAIReport: async function() {
    if(this.supervisiData.length === 0) return alert("Belum ada data supervisi untuk dievaluasi!");
    
    document.getElementById('aiReportModal').style.display = 'flex';
    document.getElementById('aiContentArea').innerHTML = `
      <div class="spinner-glowing" style="margin:40px auto;"></div>
      <div style="text-align:center; color:var(--success);">Gemini AI sedang menyusun Rekomendasi Supervisi Kurikulum Merdeka...</div>
    `;

    try {
      const dbContext = this.supervisiData.map(s => \`Guru: \${s.nama_guru}, Mapel: \${s.mapel}, Perencanaan: \${s.skor_perencanaan}/4, KBM: \${s.skor_pelaksanaan}/4. Catatan: \${s.catatan}\`).join('\\n');

      const systemPrompt = `Anda adalah "AI Assessor Pendidikan", seorang Pengawas Sekolah ahli Kurikulum Merdeka.
TUGAS: Analisis data supervisi guru yang dikirimkan. Buatkan Laporan Evaluasi Makro (Executive Summary).
FORMAT: Gunakan struktur HTML yang rapi (h3, p, ul, li) dengan styling tipis jika diperlukan. Jangan gunakan markdown.
KONTEN WAJIB:
1. Peta Kekuatan (Kelebihan sistem pengajaran saat ini)
2. Area Perbaikan (Kelemahan atau celah yang perlu dibenahi)
3. Rekomendasi Program Pelatihan (Tindakan konkrit untuk pengembangan keprofesian berkelanjutan)
NADA: Konstruktif, profesional, edukatif, dan memotivasi.`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Berikut kumpulan data supervisi semester ini:\n${dbContext}` }],
        maxTokens: 1500
      });

      if(res.error) throw new Error(res.error);

      document.getElementById('aiContentArea').innerHTML = res.text.replace(/```html/g, '').replace(/```/g, '');

    } catch(e) {
      document.getElementById('aiContentArea').innerHTML = `<div style="color:var(--danger)">Gagal memuat AI: ${e.message}</div>`;
    }
  }
};
