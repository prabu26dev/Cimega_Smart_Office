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
      // Basic context fetch: if the user mentions a student, try to provide all students to the AI 
      // (in a real scalable scenario, we would search before sending to AI, but for now we send top list or basic context)
      let contextData = "";
      if(window.ModulPD && window.ModulPD.students) {
         const sliced = window.ModulPD.students.slice(0, 50).map(s => \`\${s.name} (NISN: \${s.nisn})\`);
         contextData = "Data Siswa Tersedia:\\n" + sliced.join("\\n");
      }

      const systemPrompt = `Anda adalah "Asisten Administrator Sekolah (E-Office)" yang mahir membuat surat formal berstandar instansi pendidikan di Indonesia.
TUGAS ANDA:
Buatkan draf surat sesuai instruksi pengguna. 
FORMAT OUTPUT: 
Kembalikan HANYA teks HTML murni (tanpa tag <html>, <head>, atau <body>) yang dibungkus dalam <div id="printableArea">...</div>.
Didalam div tersebut, rancang surat dengan format Kop Surat, Nomor Surat, Tanggal, Isi, dan Tanda Tangan formal. 
Gunakan styling inline CSS untuk membuat tata letak surat resmi yang siap di print pada kertas A4 (misalnya justify, margin standar, header center).
DILARANG memberikan kalimat pengantar atau blok markdown seperti \`\`\`html. Kembalikan kode container <div> secara langsung.`;

      const userPrompt = `Instruksi Pembuatan Surat: ${promptValue}\n\nReferensi Konteks: ${contextData}`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 2000
      });

      if(res.error) throw new Error(res.error);

      // Clean AI output if it includes markdown boundaries
      const htmlOutput = res.text.replace(/```html/gi, '').replace(/```/g, '').trim();

      const resDiv = document.getElementById('hasilSurat');
      resDiv.innerHTML = `
        <div class="card" style="border-color:var(--success);">
          <div class="card-header">
            <div class="card-title" style="color:var(--success);">✅ Draf Surat Berhasil Dibuat</div>
            <div>
              <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
            </div>
          </div>
          <div class="card-body" style="background:#fff; border-radius:0 0 12px 12px; padding:40px; color:#000;">
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
