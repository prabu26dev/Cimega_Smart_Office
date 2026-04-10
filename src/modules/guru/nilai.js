window.ModulNilai = {
  container: null,
  students: [],
  userData: null,

  init: async function() {
    this.container = document.getElementById('modulNilaiApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
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
      const schoolId = this.userData.school_id || 'NPSN_MIGRATE';
      
      const snap = await getDocs(query(collection(db, 'students'), where('school_id', '==', schoolId)));
      this.students = [];
      snap.forEach(doc => {
        this.students.push({ id: doc.id, ...doc.data() });
      });
      this.students.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    } catch(e) {
      console.error("Gagal memuat siswa:", e);
    }
  },

  render: function() {
    let studentRows = this.students.map((s, idx) => `
      <tr>
        <td style="text-align:center;">${idx+1}</td>
        <td style="font-weight:600;">${s.name || '-'}</td>
        <td><input type="number" class="form-control n_formative_${s.id}" placeholder="-" style="padding:4px;width:60px;" /></td>
        <td><input type="number" class="form-control n_summative_${s.id}" placeholder="-" style="padding:4px;width:60px;" /></td>
        <td><input type="number" class="form-control n_final_${s.id}" placeholder="-" style="padding:4px;width:60px;" /></td>
      </tr>
    `).join('');

    if(this.students.length === 0) {
      studentRows = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">Siswa tidak ditemukan. Hubungi OPS.</td></tr>`;
    }

    this.container.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">📉 LEGER PENGOLAHAN NILAI</div>
        </div>
        <div class="card-body" style="padding:0;">
          <div style="padding:14px; border-bottom:1px solid rgba(0,229,255,0.08);">
            <div class="grid-2">
              <div class="form-group" style="margin:0;"><label class="form-label">Mata Pelajaran</label><input class="form-control" id="nlMapel" placeholder="Bahasa Indonesia" /></div>
              <div class="form-group" style="margin:0;"><label class="form-label">Lingkup Materi (TP)</label><input class="form-control" id="nlLingkup" placeholder="Deskripsi TP..." /></div>
            </div>
          </div>
          <div class="table-wrap" style="border:none; border-radius:0;">
            <table>
              <thead>
                <tr>
                  <th style="width:40px;text-align:center;">No</th>
                  <th>Nama Siswa</th>
                  <th style="width:100px;">Formatif</th>
                  <th style="width:100px;">Sumatif Harian</th>
                  <th style="width:100px;">Sumatif SAS</th>
                </tr>
              </thead>
              <tbody>${studentRows}</tbody>
            </table>
          </div>
          <div style="padding:14px; background:rgba(0,229,255,0.03); border-top:1px solid rgba(0,229,255,0.08); display:flex; justify-content:space-between; align-items:center;">
             <span style="font-size:10px; color:var(--muted);">Multi-tenant Isolation Active (${this.userData.school_id})</span>
             <button class="btn btn-ghost btn-sm" onclick="window.ModulNilai.generateRaporNarratives()">✨ Generate Narasi Rapor (AI)</button>
          </div>
        </div>
      </div>
      <div id="hasilRaporContainer" style="display:none;"></div>
    `;
  },

  generateRaporNarratives: async function() {
    const mapel = document.getElementById('nlMapel').value.trim();
    const lingkup = document.getElementById('nlLingkup').value.trim();
    if (!mapel || !lingkup) { showToast('warn', 'Perhatian', 'Mapel dan TP wajib diisi!'); return; }
    if (this.students.length === 0) return;

    const payloads = this.students.map(s => {
      const vF = document.querySelector(`.n_formative_${s.id}`)?.value || 0;
      const vS = document.querySelector(`.n_summative_${s.id}`)?.value || 0;
      const vA = document.querySelector(`.n_final_${s.id}`)?.value || 0;
      const avg = Math.round((parseInt(vF) + parseInt(vS) + parseInt(vA)) / 3) || 0;
      return { nama: s.name, nilai_rata_rata: avg };
    });

    const hasilDiv = document.getElementById('hasilRaporContainer');
    hasilDiv.innerHTML = `<div style="text-align:center;padding:30px;"><div class="spinner"></div><div style="margin-top:10px;color:var(--cyan);font-size:12px;">AI Menyusun Capaian Rapor...</div></div>`;
    hasilDiv.style.display = 'block';

    try {
      const systemPrompt = `Anda adalah "Asisten Penulisan Rapor Kurikulum Merdeka". 
TUGAS: Membuat DESKRIPSI CP (Capaian Pembelajaran) berdasarkan nilai angka.
ATURAN:
1. Jika nilai tinggi (>80), gunakan kata kerja: "Sangat baik dalam memahami [TP], perlu bimbingan sedikit pada..."
2. Jika nilai sedang (70-80), gunakan kata kerja: "Cukup baik dalam memahami [TP], perlu penguatan pada..."
3. Jika nilai rendah (<70), gunakan kata kerja: "Menunjukkan penguasaan yang perlu ditingkatkan pada [TP]..."
HASIL HARUS JSON MURNI: [{"nama": "...", "nilai": 85, "deskripsi": "..."}]
Dilarang ada teks lain.`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Mapel: ${mapel}, Lingkup Materi: ${lingkup}, Data Siswa: ${JSON.stringify(payloads)}` }],
        maxTokens: 3000
      });

      if(res.error) throw new Error(res.error);
      const cleanedText = res.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      this.renderHasilRapor(parsedData);
      showToast('success', 'Selesai', 'Deskripsi Rapor berhasil dibuat.');
    } catch(err) { showToast('error', 'Gagal', err.message); }
  },

  renderHasilRapor: function(raporArray) {
    const hasilDiv = document.getElementById('hasilRaporContainer');
    let html = `
      <div class="card" style="margin-bottom: 16px; border-color: var(--success);">
        <div class="card-header"><div class="card-title" style="color:var(--success);">✅ DESKRIPSI CAPAIAN RAPOR</div></div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrap" style="border:none;">
            <table><thead><tr><th>Siswa</th><th style="width:60px;">Nilai</th><th>Deskripsi (AI)</th></tr></thead><tbody>
    `;
    raporArray.forEach(item => {
      html += `<tr><td style="font-weight:600;">${item.nama}</td><td style="text-align:center;font-weight:700;color:var(--cyan);">${item.nilai}</td><td style="font-size:11px;line-height:1.4;">${item.deskripsi}</td></tr>`;
    });
    html += `</tbody></table></div></div></div>`;
    hasilDiv.innerHTML = html;
  }
};
