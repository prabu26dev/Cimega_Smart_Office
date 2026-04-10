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
      const systemPrompt = `Anda adalah "Asisten Ahli Evaluasi Pendidikan SD". Buat instrumen HOTS dalam JSON.`;
      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Mapel: ${mapel}, Indikator: ${indikator}, Level: ${document.getElementById('asLevel').value}, Bentuk: ${document.getElementById('asBentuk').value}` }]
      });

      if(res.error) throw new Error(res.error);
      const text = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(text);
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
          <div class="card-title" style="color: var(--success);">✅ HASIL BANK SOAL</div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="window.ModulAsesmen.saveSoal()">💾 Simpan ke Bank Soal</button>
            <button class="btn btn-ghost btn-sm" onclick="CimegaUtils.copyToClipboard('soalViewer')">Salin</button>
          </div>
        </div>
        <div class="card-body" id="soalViewer">
    `;
    soalArray.forEach((item, index) => {
      html += `
        <div style="margin-bottom:15px; border-bottom:1px solid rgba(0,229,255,0.1); padding-bottom:10px;">
          <div style="font-weight:700;">No. ${index+1}</div>
          <div style="font-size:11px; font-style:italic; color:var(--muted);">${item.stimulus || ''}</div>
          <div style="font-size:12px; margin:5px 0;">${item.pertanyaan}</div>
          <div style="font-size:11px; background:rgba(0,255,136,0.05); padding:8px; border-radius:4px; margin-top:5px;">
            <strong>Kunci:</strong> ${item.kunci_jawaban}
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
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
