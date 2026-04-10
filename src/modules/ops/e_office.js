window.ModulEOffice = {
  container: null,

  init: function() {
    this.container = document.getElementById('moduleEOfficeApp');
    this.render();
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card" style="margin-bottom:20px;" id="eofficePanel">
        <div class="card-header">
          <div class="card-title">🤖 AI E-OFFICE ASSISTANT (SURAT MENYURAT)</div>
        </div>
        <div class="card-body">
          <p style="font-size:12px; color:var(--muted); margin-bottom:14px;">Masukkan instruksi pembuatan surat formal. AI akan mencoba mencari relasi data (seperti Nama atau NISN) dari database jika relevan.</p>
          <div class="form-group">
            <label class="form-label">Instruksi Surat</label>
            <textarea class="form-control" id="eoPrompt" placeholder="Contoh: Buatkan draf surat keterangan aktif belajar untuk siswa bernama Budi, NISN 12345, keperluan pencairan PIP" style="height:100px;"></textarea>
          </div>
          <button class="btn btn-primary" id="btnGenSurat" onclick="window.ModulEOffice.generateSurat()">✨ Buat Surat dengan AI</button>
        </div>
      </div>

      <div id="hasilSurat" style="display:none;"></div>
    `;
  },

  generateSurat: async function() {
    const promptValue = document.getElementById('eoPrompt').value.trim();
    if(!promptValue) {
      alert("Masukkan instruksi pembuatan surat!");
      return;
    }

    const btn = document.getElementById('btnGenSurat');
    btn.disabled = true;
    btn.innerHTML = '⏳ AI Sedang Menyusun Surat...';

    try {
      let contextData = "";
      if(window.ModulPD && window.ModulPD.students) {
         const sliced = window.ModulPD.students.slice(0, 50).map(s => `${s.name} (NISN: ${s.nisn})`);
         contextData = "Data Siswa Tersedia:\n" + sliced.join("\n");
      }

      const systemPrompt = `Anda adalah "Asisten Administrasi Sekolah (E-Office) Profesional". TUGAS ANDA: Membuat draf surat formal (Surat Keterangan, Surat Tugas, SK, dll) berdasarkan metadata.
PERSYARATAN:
1. Gunakan bahasa Indonesia formal (EYD).
2. Sertakan Kop Surat SDN Cimega, Nomor Surat (buatkan draf nomor), dan tempat tanda tangan.
3. OUTPUT HARUS berupa HTML murni di dalam <div id="printableArea" style="font-family:serif; line-height:1.6; color:#000; padding:20px;">.
4. Jangan gunakan blok markdown (\`\`\`html).
5. Buat konten yang sangat detail, akurat, dan profesional.`;

      const userPrompt = `Input Pengguna: ${promptValue}\n\nReferensi Konteks: ${contextData}`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 3000
      });

      if(res.error) throw new Error(res.error);
      const htmlOutput = res.text.replace(/```html/gi, '').replace(/```/g, '').trim();

      const resDiv = document.getElementById('hasilSurat');
      resDiv.innerHTML = `
        <div class="card" style="border-color:var(--success);">
          <div class="card-header">
            <div class="card-title" style="color:var(--success);">✅ Draf Surat Berhasil Dibuat</div>
            <div style="display:flex; gap:8px;">
               <button class="btn btn-ghost btn-sm" onclick="CimegaSharing.share(document.getElementById('eoPrompt').value.substring(0,30), 'Surat', document.getElementById('printableArea').innerHTML)">🔗 Bagikan</button>
               <button class="btn btn-primary btn-sm" onclick="CimegaPrinter.showPrintDialog(document.getElementById('printableArea').outerHTML, 'Surat_Cimega')">🖨️ Cetak / Ekspor</button>
            </div>
          </div>
          <div class="card-body" id="printableArea" style="background:#fff; border-radius:0 0 12px 12px; padding:40px; color:#000; font-family:'Times New Roman', serif;">
            ${htmlOutput}
          </div>
        </div>
      `;
      resDiv.style.display = 'block';

    } catch(e) {
      alert("Gagal memproses AI: " + e.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '✨ Buat Surat dengan AI';
    }
  }
};
