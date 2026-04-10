window.ModulAsesmen = {
  container: null,
  lastGeneratedSoal: null,
  userData: null,

  init: function() {
    this.container = document.getElementById('modulAsesmenApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    this.render();
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">📖 GENERATOR BANK SOAL (AI HOTS)</div>
        </div>
        <div class="card-body">
          <div class="grid-3">
            <div class="form-group">
              <label class="form-label">Level Kognitif</label>
              <select class="form-control" id="asLevel">
                <option value="C3">C3 (Menerapkan)</option>
                <option value="C4" selected>C4 (Menganalisis) - HOTS</option>
                <option value="C5">C5 (Mengevaluasi) - HOTS</option>
                <option value="C6">C6 (Mencipta) - HOTS</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Bentuk Soal</label>
              <select class="form-control" id="asBentuk">
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                <option value="Uraian">Uraian / Essay</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah Soal</label>
              <input class="form-control" type="number" id="asJumlah" value="3" min="1" max="10"/>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Mata Pelajaran & Kelas</label><input class="form-control" id="asMapel" placeholder="IPAS Kelas 4" /></div>
          <div class="form-group"><label class="form-label">Indikator Soal</label><textarea class="form-control" id="asIndikator" placeholder="Siswa dapat menganalisis..."></textarea></div>
          <button class="btn btn-primary" id="btnGenSoal" onclick="window.ModulAsesmen.generateBankSoal()">✨ Generate Soal HOTS</button>
        </div>
      </div>
      <div id="hasilBankSoal" style="display:none;"></div>
    `;
  },

  generateBankSoal: async function() {
    const mapel = document.getElementById('asMapel').value.trim();
    const indikator = document.getElementById('asIndikator').value.trim();
    if (!mapel || !indikator) { showToast('warn', 'Perhatian', 'Mapel dan Indikator wajib diisi!'); return; }

    const btn = document.getElementById('btnGenSoal');
    btn.disabled = true; btn.innerHTML = '⏳ Menyusun Soal HOTS...';

    try {
      const systemPrompt = `Anda adalah "Pakar Evaluasi Pendidikan Digital". TUGAS ANDA: Membuat instrumen asesmen Kurikulum Merdeka yang akurat.
HASIL OUTPUT HARUS JSON MURNI:
{
  "soal": [
    {
      "stimulus": "Teks/Konteks masalah nyata (HOTS)",
      "pertanyaan": "Kalimat tanya",
      "pilihan": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "kunci_jawaban": "A",
      "pembahasan": "Alasan jawaban benar"
    }
  ]
}
Gunakan Level Kognitif ${document.getElementById('asLevel').value} dan Bentuk Soal ${document.getElementById('asBentuk').value}. Dilarang ada teks lain selain JSON.`;
      
      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Buatkan ${document.getElementById('asJumlah').value} soal untuk ${mapel}. Indikator: ${indikator}` }]
      });

      if(res.error) throw new Error(res.error);
      const cleanedText = res.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      this.lastGeneratedSoal = parsedData.soal;
      this.renderHasilSoal(parsedData.soal, document.getElementById('asBentuk').value);
      showToast('success', 'Selesai', 'Bank soal berhasil digenerate AI.');
    } catch(err) { showToast('error', 'Gagal', err.message); }
    finally { btn.disabled = false; btn.innerHTML = '✨ Generate Soal HOTS'; }
  },

  renderHasilSoal: function(soalArray, bentuk) {
    const hasilDiv = document.getElementById('hasilBankSoal');
    let html = `
      <div class="card" style="margin-bottom: 16px; border-color: var(--success);">
        <div class="card-header">
          <div class="card-title">✅ BANK SOAL AI (HASIL)</div>
          <div style="display:flex; gap:8px;">
             <button class="btn btn-ghost btn-sm" onclick="CimegaSharing.share('Bank Soal', 'Asesmen', document.getElementById('soalContent').innerHTML)">🔗 Bagikan</button>
             <button class="btn btn-primary btn-sm" onclick="CimegaPrinter.showPrintDialog(document.getElementById('soalContent').outerHTML, 'Bank_Soal_Cimega')">🖨️ Ekspor</button>
             <button class="btn btn-success btn-sm" onclick="window.ModulAsesmen.saveSoal()">💾 Simpan</button>
          </div>
        </div>
        <div class="card-body" id="soalContent" style="background:#fff; color:#000; padding:30px; font-family:serif;">
          <h2 style="text-align:center; font-size:16px;">BANK SOAL KURIKULUM MERDEKA</h2>
          <hr style="border:1px solid #000; margin-bottom:20px;">
          ${soalArray.map((s, i) => `
            <div style="margin-bottom:15px;">
              <p><b>${i + 1}. ${s.pertanyaan}</b></p>
              <div style="margin-left:15px;">
                ${(s.pilihan || []).map((p) => `<p>${p}</p>`).join('')}
              </div>
              <div style="font-size:11px; background:rgba(0,255,136,0.05); padding:8px; border-radius:4px; margin-top:5px;">
                <strong>Kunci:</strong> ${s.kunci_jawaban}
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
    hasilDiv.innerHTML = html; hasilDiv.style.display = 'block';
  },

  saveSoal: async function() {
    if (!this.lastGeneratedSoal) return;
    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'bank_soal'), {
        soal: this.lastGeneratedSoal,
        school_id: this.userData.school_id || 'NPSN_MIGRATE',
        guru_id: this.userData.id,
        createdAt: serverTimestamp()
      });
      showToast('success', 'Berhasil', 'Soal disimpan di Bank Soal Sekolah.');
    } catch (e) { showToast('error', 'Gagal', e.message); }
  }
};
