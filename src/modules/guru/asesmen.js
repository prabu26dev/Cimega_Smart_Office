window.ModulAsesmen = {
  container: null,

  init: function() {
    this.container = document.getElementById('modulAsesmenApp');
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
                <option value="C3 (Menerapkan)">C3 (Menerapkan)</option>
                <option value="C4 (Menganalisis)" selected>C4 (Menganalisis) - HOTS</option>
                <option value="C5 (Mengevaluasi)">C5 (Mengevaluasi) - HOTS</option>
                <option value="C6 (Mencipta)">C6 (Mencipta) - HOTS</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Bentuk Soal</label>
              <select class="form-control" id="asBentuk">
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                <option value="Menjodohkan">Menjodohkan</option>
                <option value="Isian Singkat">Isian Singkat</option>
                <option value="Uraian">Uraian / Essay</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah Soal</label>
              <input class="form-control" type="number" id="asJumlah" value="3" min="1" max="10"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Mata Pelajaran & Kelas</label>
            <input class="form-control" id="asMapel" placeholder="Contoh: IPAS Kelas 4"/>
          </div>
          <div class="form-group">
            <label class="form-label">Tujuan Pembelajaran / Indikator</label>
            <textarea class="form-control" id="asIndikator" placeholder="Contoh: Disajikan teks cerita, siswa dapat menganalisis penyebab..."></textarea>
          </div>
          <button class="btn btn-primary" id="btnGenSoal" onclick="window.ModulAsesmen.generateBankSoal()">
            ✨ Generate Soal HOTS
          </button>
        </div>
      </div>

      <div id="hasilBankSoal" style="display:none;"></div>
    `;
  },

  generateBankSoal: async function() {
    const level = document.getElementById('asLevel').value;
    const bentuk = document.getElementById('asBentuk').value;
    const jumlah = document.getElementById('asJumlah').value;
    const mapel = document.getElementById('asMapel').value.trim();
    const indikator = document.getElementById('asIndikator').value.trim();

    if (!mapel || !indikator) {
      showToast('warn', 'Perhatian', 'Mapel dan Indikator Soal wajib diisi!');
      return;
    }

    const btn = document.getElementById('btnGenSoal');
    btn.disabled = true;
    btn.innerHTML = '⏳ Menyusun Soal HOTS...';

    try {
      const systemPrompt = `Anda adalah "Asisten Ahli Evaluasi Pendidikan SD".
TUGAS ANDA:
Buatlah instrumen/soal evaluasi berstandar HOTS (Higher Order Thinking Skills) untuk siswa Sekolah Dasar berdasarkan parameter yang diberikan.
Anda HARUS menggunakan stimulus (teks, kasus, atau ilustrasi fiksi) sebelum pertanyaan diajukan.
Anda HARUS menghasilkan output dalam format JSON murni berstruktur:
{
  "soal": [
    {
      "stimulus": "Teks cerita/kasus singkat...",
      "pertanyaan": "Pertanyaan spesifik...",
      "pilihan_jawaban": ["A...", "B...", "C...", "D..."], // Isi jika bentuk soal PG/PG Kompleks, sebaliknya kasih array kosong []
      "kunci_jawaban": "Jawaban yang benar...",
      "pembahasan": "Keterkaitan dengan level kognitif..."
    }
  ]
}
DILARANG menggunakan teks markdown lain selain JSON murni tersebut.`;

      const userPrompt = `Mata Pelajaran: ${mapel}
Tujuan/Indikator: ${indikator}
Level Kognitif Taks. Bloom: ${level}
Bentuk Soal: ${bentuk}
Jumlah Soal: ${jumlah} item`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 2500
      });

      if(res.error) throw new Error(res.error);

      let parsedData;
      try {
        const text = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(text);
      } catch(e) {
        console.error("Gagal parse keluaran AI:", res.text);
        throw new Error("Keluaran AI tidak berformat JSON yang valid.");
      }

      this.renderHasilSoal(parsedData.soal, bentuk);
      showToast('success', 'Selesai', 'Bank soal berhasil digenerate.');

    } catch(err) {
      showToast('error', 'Gagal', err.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '✨ Generate Soal HOTS';
    }
  },

  renderHasilSoal: function(soalArray, bentuk) {
    const hasilDiv = document.getElementById('hasilBankSoal');
    if (!soalArray || soalArray.length === 0) {
      hasilDiv.innerHTML = `<div style="padding:20px; text-align:center; color:var(--danger)">AI tidak mengembalikan soal.</div>`;
      hasilDiv.style.display = 'block';
      return;
    }

    let html = `
      <div class="card" style="margin-bottom: 16px; border-color: var(--success);">
        <div class="card-header">
          <div class="card-title" style="color: var(--success);">✅ HASIL BANK SOAL</div>
          <button class="btn btn-ghost btn-sm" onclick="copyAiResult('soalViewer')">Salin Output</button>
        </div>
        <div class="card-body" id="soalViewer">
    `;

    soalArray.forEach((item, index) => {
      html += `
        <div style="margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid rgba(0,229,255,0.1);">
          <div style="font-weight:700; color:var(--text); margin-bottom:6px;">Soal No. ${index+1}</div>
          ${item.stimulus ? `<div style="font-size:11px; font-style:italic; border-left:3px solid var(--cyan); padding-left:10px; margin-bottom:10px; color:var(--muted)">Stimulus:<br/>${item.stimulus.replace(/\\n/g, '<br/>')}</div>` : ''}
          <div style="font-size:12px; color:var(--text); margin-bottom:8px;">${item.pertanyaan.replace(/\\n/g, '<br/>')}</div>
      `;

      if (bentuk.includes('Pilihan Ganda') && item.pilihan_jawaban && item.pilihan_jawaban.length > 0) {
        html += `<ol type="A" style="margin-left:20px; font-size:12px; color:var(--text); margin-bottom:10px;">`;
        item.pilihan_jawaban.forEach(pj => {
          html += `<li style="margin-bottom:3px;">${pj}</li>`;
        });
        html += `</ol>`;
      }

      html += `
          <div style="font-size:11px; background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.15); border-radius:6px; padding:8px; margin-top:10px;">
            <strong style="color:var(--success);">Kunci Jawaban:</strong> <span style="color:var(--text);">${item.kunci_jawaban}</span><br/>
            <strong style="color:var(--cyan);display:inline-block;margin-top:6px;">Pembahasan:</strong> <span style="color:var(--text);">${item.pembahasan}</span>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    hasilDiv.innerHTML = html;
    hasilDiv.style.display = 'block';
  }
};
