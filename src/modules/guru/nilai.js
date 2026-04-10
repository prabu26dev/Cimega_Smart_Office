window.ModulNilai = {
  container: null,
  students: [],

  init: async function() {
    this.container = document.getElementById('modulNilaiApp');
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
      const snap = await getDocs(query(collection(db, 'students'), where('sekolah', '==', userData.sekolah)));
      this.students = [];
      snap.forEach(doc => {
        this.students.push({ id: doc.id, ...doc.data() });
      });
      this.students.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    } catch(e) {
      console.error("Gagal memuat siswa di modul nilai:", e);
    }
  },

  render: function() {
    // Generate Table Rows for Leger Nilai
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
      studentRows = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">Siswa tidak ditemukan.</td></tr>`;
    }

    this.container.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">📉 LEGER PENGOLAHAN NILAI</div>
        </div>
        <div class="card-body" style="padding:0;">
          <div style="padding:14px; border-bottom:1px solid rgba(0,229,255,0.08);">
            <div class="grid-2">
              <div class="form-group" style="margin:0;">
                <label class="form-label">Mata Pelajaran</label>
                <input class="form-control" id="nlMapel" placeholder="Contoh: Bahasa Indonesia" />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label">Deskripsi Lingkup Materi (TP)</label>
                <input class="form-control" id="nlLingkup" placeholder="Ketik TP yang dinilai..." />
              </div>
            </div>
          </div>
          <div class="table-wrap" style="border:none; border-radius:0;">
            <table>
              <thead>
                <tr>
                  <th style="width:40px;text-align:center;">No</th>
                  <th>Nama Siswa</th>
                  <th style="width:100px;">Nilai Formatif</th>
                  <th style="width:100px;">Sumatif Lingkup (Harian)</th>
                  <th style="width:100px;">Sumatif Akhir (SAS)</th>
                </tr>
              </thead>
              <tbody>
                ${studentRows}
              </tbody>
            </table>
          </div>
          <div style="padding:14px; background:rgba(0,229,255,0.03); border-top:1px solid rgba(0,229,255,0.08); display:flex; justify-content:space-between; align-items:center;">
             <span style="font-size:10px; color:var(--muted);">Pastikan data telah terisi sebelum menyimpan.</span>
             <div>
                <button class="btn btn-ghost" onclick="window.ModulNilai.generateRaporNarratives()">✨ Generate Narasi Rapor</button>
             </div>
          </div>
        </div>
      </div>

      <div id="hasilRaporContainer" style="display:none;"></div>
    `;
  },

  generateRaporNarratives: async function() {
    const mapel = document.getElementById('nlMapel').value.trim();
    const lingkup = document.getElementById('nlLingkup').value.trim();

    if (!mapel || !lingkup) {
      showToast('warn', 'Perhatian', 'Mapel dan Deskripsi Lingkup Materi wajib diisi untuk menghasilkan narasi!');
      return;
    }

    if (this.students.length === 0) return;

    // Collect Data
    const payloads = [];
    this.students.forEach(s => {
      const vF = document.querySelector(\`.n_formative_\${s.id}\`)?.value || 0;
      const vS = document.querySelector(\`.n_summative_\${s.id}\`)?.value || 0;
      const vA = document.querySelector(\`.n_final_\${s.id}\`)?.value || 0;

      const avg = Math.round((parseInt(vF) + parseInt(vS) + parseInt(vA)) / 3) || 0;
      
      payloads.push({
        nama: s.name,
        nilai_rata_rata: avg
      });
    });

    const hasilDiv = document.getElementById('hasilRaporContainer');
    hasilDiv.innerHTML = `<div style="text-align:center;padding:30px;"><div class="spinner"></div><div style="margin-top:10px;color:var(--cyan);font-size:12px;">AI Menyusun Deskripsi Capaian...</div></div>`;
    hasilDiv.style.display = 'block';

    try {
      const systemPrompt = `Anda adalah "Sistem Penilaian Kurikulum Merdeka".
TUGAS ANDA:
Buatkan "Deskripsi Capaian Rapor Siswa" berdasarkan Nilai Rata-Rata untuk Mata Pelajaran spesifik.
ATURAN KURIKULUM MERDEKA: Deskripsi harus formatif, menonjolkan kemampuan positif (Menunjukkan penguasaan yang sangat baik dalam...), dan memberikan motivasi pada bagian yang perlu bimbingan.
Anda HARUS menghasilkan output JSON murni (array) berstruktur:
[
  {
    "nama": "Nama Siswa...",
    "nilai": 85,
    "deskripsi": "Ananda menunjukkan penguasaan yang sangat baik dalam [Materi]..."
  }
]
DILARANG menggunakan markdown selain JSON murni.`;

      const userPrompt = `Mata Pelajaran: ${mapel}
Materi / Lingkup TP: ${lingkup}

Data Siswa:
${JSON.stringify(payloads, null, 2)}`;

      const res = await window.cimegaAPI.geminiAsk({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 3000
      });

      if(res.error) throw new Error(res.error);

      let parsedData;
      try {
        const text = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(text);
      } catch(e) {
        throw new Error("Keluaran AI tidak berformat JSON yang valid.");
      }

      this.renderHasilRapor(parsedData);
      showToast('success', 'Selesai', 'Deskripsi Capaian Rapor berhasil dibuat.');

    } catch(err) {
      hasilDiv.innerHTML = `<div style="padding:20px; text-align:center; color:var(--danger)">Gagal: ${err.message}</div>`;
      showToast('error', 'Gagal', err.message);
    }
  },

  renderHasilRapor: function(raporArray) {
    const hasilDiv = document.getElementById('hasilRaporContainer');
    
    let html = `
      <div class="card" style="margin-bottom: 16px; border-color: var(--success);">
        <div class="card-header">
          <div class="card-title" style="color: var(--success);">✅ DESKRIPSI CAPAIAN RAPOR INTRAKURIKULER</div>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrap" style="border:none; border-radius:0;">
            <table>
              <thead>
                <tr>
                  <th style="width:150px;">Nama Siswa</th>
                  <th style="width:60px;">Nilai</th>
                  <th>Deskripsi Capaian (AI Generated)</th>
                </tr>
              </thead>
              <tbody>
    `;

    raporArray.forEach(item => {
      html += `
        <tr>
          <td style="font-weight:600;">${item.nama}</td>
          <td style="text-align:center;font-weight:700;color:var(--cyan);">${item.nilai}</td>
          <td style="font-size:11px;line-height:1.4;">${item.deskripsi}</td>
        </tr>
      `;
    });

    html += `</tbody></table></div></div></div>`;
    hasilDiv.innerHTML = html;
  }
};
