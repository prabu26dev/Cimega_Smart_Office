window.ModulPerencanaan = {
  container: null,
  lastGeneratedData: null,
  userData: null,

  init: function() {
    this.container = document.getElementById('modulPerencanaanApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    this.render();
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="card-title">📝 GENERATOR ADMINISTRASI AI</div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-ghost btn-sm" onclick="window.ModulPerencanaan.switchView('ma')">Modul Ajar</button>
            <button class="btn btn-ghost btn-sm" onclick="window.ModulPerencanaan.switchView('prota')">Prota/Prosem</button>
            <button class="btn btn-ghost btn-sm" onclick="window.ModulPerencanaan.switchView('p5')">Projek P5</button>
          </div>
        </div>
        <div class="card-body">
          <!-- MODUL AJAR VIEW -->
          <div id="view-ma" class="plan-subview">
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Mata Pelajaran</label><input class="form-control" id="mpMapel" placeholder="Matematika" /></div>
              <div class="form-group"><label class="form-label">Fase & Kelas</label><select class="form-control" id="mpFase">
                <option value="A (Kelas 1-2)">Fase A (Kelas 1-2)</option><option value="B (Kelas 3-4)">Fase B (Kelas 3-4)</option><option value="C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
              </select></div>
            </div>
            <div class="form-group"><label class="form-label">Capaian Pembelajaran (CP) / Elemen</label><input class="form-control" id="mpCP" placeholder="Contoh: Bilangan" /></div>
            <div class="form-group"><label class="form-label">Tujuan Pembelajaran (TP)</label><textarea class="form-control" id="mpTP" placeholder="Peserta didik dapat membandingkan dua bilangan pecahan..."></textarea></div>
            <button class="btn btn-primary" id="btnGenModul" onclick="window.ModulPerencanaan.generateModulAjar()">✨ Generate Isi Modul Ajar Lengkap (AI)</button>
          </div>

          <!-- PROTA PROSEM VIEW -->
          <div id="view-prota" class="plan-subview" style="display:none;">
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Tahun Pelajaran</label><input class="form-control" id="ptTahun" value="2024/2025" /></div>
              <div class="form-group"><label class="form-label">Mata Pelajaran</label><input class="form-control" id="ptMapel" placeholder="Bahasa Indonesia" /></div>
            </div>
            <div class="form-group"><label class="form-label">Daftar Lingkup Materi (Opsional)</label><textarea class="form-control" id="ptMateri" placeholder="Biarkan kosong jika ingin AI yang menentukan materi standar..."></textarea></div>
            <button class="btn btn-primary" id="btnGenProta" onclick="window.ModulPerencanaan.generateProta()">📅 Generate Rencana Semester (AI)</button>
          </div>

          <!-- P5 VIEW -->
          <div id="view-p5" class="plan-subview" style="display:none;">
            <div class="form-group">
              <label class="form-label">Tema Proyek</label>
              <select class="form-control" id="p5Tema">
                <option value="Gaya Hidup Berkelanjutan">Gaya Hidup Berkelanjutan</option>
                <option value="Kearifan Lokal">Kearifan Lokal</option>
                <option value="Bhinneka Tunggal Ika">Bhinneka Tunggal Ika</option>
                <option value="Bangunlah Jiwa dan Raganya">Bangunlah Jiwa dan Raganya</option>
                <option value="Kewirausahaan">Kewirausahaan</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Judul Proyek (Identitas)</label><input class="form-control" id="p5Judul" placeholder="Contoh: Apotek Hidup Cilik" /></div>
            <button class="btn btn-primary" id="btnGenP5" onclick="window.ModulPerencanaan.generateP5()">🌱 Generate Modul Projek Lengkap (AI)</button>
          </div>
        </div>
      </div>

      <div id="hasilAnalisisAI" style="display:none;"></div>
    `;
  },

  generateModulAjar: async function() {
    const mapel = document.getElementById('mpMapel').value.trim();
    const fase = document.getElementById('mpFase').value;
    const tp = document.getElementById('mpTP').value.trim();

    if (!mapel || !tp) {
      showToast('warn', 'Perhatian', 'Mapel dan Tujuan Pembelajaran (TP) harus diisi!');
      return;
    }

    const btn = document.getElementById('btnGenModul');
    btn.disabled = true;
    btn.innerHTML = '⏳ AI Sedang Merancang Modul...';

    try {
      const systemPrompt = `Anda adalah "Asisten Kurikulum Merdeka SDN Cimega" yang ahli dalam merancang Modul Ajar untuk Sekolah Dasar.
TUGAS ANDA:
Buatkan "Pertanyaan Pemantik" dan "Langkah Kegiatan" (Pendahuluan, Inti, Penutup) berdasarkan Mata Pelajaran, Fase, dan Tujuan Pembelajaran berikut.
Anda HARUS menghasilkan output dalam format JSON murni yang sesuai dengan struktur berikut:
{
  "pertanyaan_pemantik": ["pertanyaan 1", "pertanyaan 2"],
  "langkah_kegiatan": {
    "pendahuluan": ["langkah 1", "langkah 2"],
    "inti": ["langkah 1", "langkah 2", "langkah 3"],
    "penutup": ["langkah 1", "langkah 2"]
  }
}
DILARANG memberikan teks pengantar atau markdown lain selain JSON murni tersebut.`;

      const userPrompt = `Mata Pelajaran: ${mapel}\nFase: ${fase}\nTujuan Pembelajaran (TP): ${tp}`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        maxTokens: 1500
      });

      if (res.error) throw new Error(res.error);

      let parsedData;
      try {
        const text = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(text);
      } catch(e) {
        throw new Error("Keluaran AI tidak berformat JSON yang valid.");
      }

      this.lastGeneratedData = { ...parsedData, mapel, fase, tp };
      this.renderHasilAI(parsedData);
      showToast('success', 'Selesai', 'Modul Ajar berhasil digenerate AI');

    } catch(err) {
      showToast('error', 'Gagal', err.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '✨ Generate Isi Modul Ajar Lengkap (AI)';
    }
  },

  switchView: function(view) {
    document.querySelectorAll('.plan-subview').forEach(v => v.style.display = 'none');
    document.getElementById('view-' + view).style.display = 'block';
    document.getElementById('hasilAnalisisAI').style.display = 'none';
  },

  generateProta: async function() {
    const mapel = document.getElementById('ptMapel').value.trim();
    const tahun = document.getElementById('ptTahun').value;
    const materi = document.getElementById('ptMateri').value.trim();

    if (!mapel) return showToast('warn', 'Ops', 'Mata Pelajaran wajib diisi!');

    const btn = document.getElementById('btnGenProta');
    btn.disabled = true;
    btn.innerHTML = '⏳ AI Menghitung Alokasi Waktu...';

    try {
      const res = await window.CimegaAI.ask({
        system: `Anda adalah Ahli Penjadwalan Kurikulum Merdeka. Buatkan Program Semester (Prosem) dalam format tabel HTML untuk mata pelajaran ${mapel} tahun ${tahun}. Tentukan lingkup materi jika input kosong, alokasi JP (Jam Pelajaran) yang masuk akal, dan bulan pelaksanaan (Juli-Desember untuk Ganjil, Januari-Juni untuk Genap).`,
        messages: [{ role: 'user', content: `Buatkan Prosem lengkap untuk: ${mapel}. Materi Referensi: ${materi || 'Sesuai kurikulum standar'}` }]
      });

      if (res.error) throw new Error(res.error);
      this.renderHasilGeneric(res.text, 'Rencana Semester (Prosem)');
    } catch(e) { showToast('error', 'Gagal', e.message); }
    finally { btn.disabled = false; btn.innerHTML = '📅 Generate Rencana Semester (AI)'; }
  },

  generateP5: async function() {
    const tema = document.getElementById('p5Tema').value;
    const judul = document.getElementById('p5Judul').value.trim() || "Proyek Tanpa Judul";

    const btn = document.getElementById('btnGenP5');
    btn.disabled = true;
    btn.innerHTML = '⏳ AI Merancang Modul Projek P5...';

    try {
      const res = await window.CimegaAI.ask({
        system: `Anda adalah Fasilitator Projek Penguatan Profil Pelajar Pancasila (P5). Buatkan draf modul projek lengkap mencakup: 1. Dimensi, Elemen, Sub Elemen. 2. Deskripsi Projek. 3. Alur Kegiatan (Tahap Pengenalan, Kontekstualisasi, Aksi, Refleksi, Tindak Lanjut).`,
        messages: [{ role: 'user', content: `Buat modul P5 bertema: ${tema} dengan judul: ${judul}` }]
      });

      if (res.error) throw new Error(res.error);
      this.renderHasilGeneric(res.text, 'Modul Projek P5');
    } catch(e) { showToast('error', 'Gagal', e.message); }
    finally { btn.disabled = false; btn.innerHTML = '🌱 Generate Modul Projek Lengkap (AI)'; }
  },

  renderHasilGeneric: function(textContent, title) {
    const hasilDiv = document.getElementById('hasilAnalisisAI');
    hasilDiv.innerHTML = `
      <div class="card" style="margin-bottom: 20px; border-color: var(--cyan);">
        <div class="card-header">
          <div class="card-title">✅ ${title} (AI GENERATED)</div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-ghost btn-sm" onclick="CimegaSharing.share('${title}', 'Perencanaan', document.getElementById('genPlanContent').innerHTML)">🔗 Bagikan</button>
            <button class="btn btn-primary btn-sm" onclick="CimegaPrinter.showPrintDialog(document.getElementById('genPlanContent').outerHTML, 'Rencana_Cimega')">🖨️ Ekspor</button>
            <button class="btn btn-success btn-sm" onclick="window.ModulPerencanaan.saveGeneric('${title}')">💾 Simpan</button>
          </div>
        </div>
        <div class="card-body" id="genPlanContent" style="font-size:13px; line-height:1.6; white-space:pre-wrap; background:#fff; color:#000; padding:30px;">${textContent}</div>
      </div>
    `;
    hasilDiv.style.display = 'block';
    hasilDiv.scrollIntoView({ behavior: 'smooth' });
  },

  renderHasilAI: function(data) {
    const hasilDiv = document.getElementById('hasilAnalisisAI');
    
    let html = `
      <div class="card" style="margin-bottom: 16px; border-color: var(--success);">
        <div class="card-header">
          <div class="card-title" style="color: var(--success);">✅ HASIL GENERATE AI</div>
          <div style="display:flex; gap:8px;">
             <button class="btn btn-ghost btn-sm" onclick="CimegaSharing.share('Modul Ajar', 'Modul Ajar', document.getElementById('modulAjarContent').innerHTML)">🔗 Bagikan</button>
             <button class="btn btn-primary btn-sm" onclick="CimegaPrinter.showPrintDialog(document.getElementById('modulAjarContent').outerHTML, 'Modul_Ajar_Cimega')">🖨️ Ekspor</button>
             <button class="btn btn-success btn-sm" onclick="window.ModulPerencanaan.saveModul()">💾 Ajukan</button>
          </div>
        </div>
        <div class="card-body" id="modulAjarContent" style="background:#fff; color:#000; padding:30px;">
          <h3 style="font-family:'Orbitron',sans-serif;font-size:12px;color:var(--cyan);margin-bottom:8px">❓ Pertanyaan Pemantik</h3>
          <ul style="margin-left: 20px; font-size:12px; color:var(--text); margin-bottom: 14px;">
            ${(data.pertanyaan_pemantik || []).map(p => `<li style="margin-bottom:4px;">${p}</li>`).join('')}
          </ul>
          <h3 style="font-family:'Orbitron',sans-serif;font-size:12px;color:var(--cyan);margin-bottom:8px">🏃‍♂️ Langkah Kegiatan</h3>
          <div style="font-size:12px; color:var(--text);">
             <strong>Pendahuluan:</strong>
             <ul style="margin-left:20px; margin-bottom:10px;">${(data.langkah_kegiatan?.pendahuluan || []).map(p => `<li>${p}</li>`).join('')}</ul>
             <strong>Inti:</strong>
             <ul style="margin-left:20px; margin-bottom:10px;">${(data.langkah_kegiatan?.inti || []).map(p => `<li>${p}</li>`).join('')}</ul>
             <strong>Penutup:</strong>
             <ul style="margin-left:20px;">${(data.langkah_kegiatan?.penutup || []).map(p => `<li>${p}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `;

    hasilDiv.innerHTML = html;
    hasilDiv.style.display = 'block';
    hasilDiv.scrollIntoView({ behavior: 'smooth' });
  },

  saveGeneric: async function(tipe) {
    const content = document.getElementById('hasilAnalisisAI').innerText;
    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, "administrasi_guru"), {
        tipe: tipe,
        content: content,
        school_id: this.userData.school_id || 'Global',
        teacher_id: this.userData.id,
        teacher_name: this.userData.nama,
        createdAt: serverTimestamp()
      });
      showToast('success', 'Tersimpan', `${tipe} berhasil disimpan ke Cloud.`);
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  saveModul: async function() {
    if (!this.lastGeneratedData) return;
    
    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, "perencanaan"), {
        ...this.lastGeneratedData,
        school_id: this.userData.school_id || 'NPSN_MIGRATE',
        teacher_id: this.userData.id,
        teacher_name: this.userData.nama,
        status: 'waiting_approval',
        createdAt: serverTimestamp()
      });
      
      showToast('success', 'Berhasil', 'Modul Ajar disimpan dan diajukan pengesahan.');
      document.getElementById('hasilAnalisisAI').style.display = 'none';
    } catch (e) {
      showToast('error', 'Gagal', e.message);
    }
  }
};
