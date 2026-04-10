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
          <div class="card-title">📝 GENERATOR MODUL AJAR (AI)</div>
        </div>
        <div class="card-body">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Mata Pelajaran</label>
              <input class="form-control" id="mpMapel" placeholder="Contoh: Matematika" />
            </div>
            <div class="form-group">
              <label class="form-label">Fase & Kelas</label>
              <select class="form-control" id="mpFase">
                <option value="A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                <option value="B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                <option value="C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Capaian Pembelajaran (CP) / Elemen</label>
            <input class="form-control" id="mpCP" placeholder="Contoh: Bilangan" />
          </div>
          <div class="form-group">
            <label class="form-label">Tujuan Pembelajaran (TP)</label>
            <textarea class="form-control" id="mpTP" placeholder="Contoh: Peserta didik dapat membandingkan dua bilangan pecahan..."></textarea>
          </div>
          <button class="btn btn-primary" id="btnGenModul" onclick="window.ModulPerencanaan.generateModulAjar()">
            ✨ Generate Langkah Kegiatan & Pertanyaan Pemantik
          </button>
        </div>
      </div>

      <div id="hasilModulAjar" style="display:none;"></div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-title">🌱 MODUL PROJEK (P5)</div>
        </div>
        <div class="card-body">
          <p style="color:var(--muted);font-size:11px;margin-bottom:12px;">Pengembangan modul projek akan ditambahkan pada rilis berikutnya.</p>
          <button class="btn btn-ghost btn-sm" disabled>Pilih Tema & Dimensi P5</button>
        </div>
      </div>
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
    btn.innerHTML = '⏳ Sedang Menganalisis...';

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
      btn.innerHTML = '✨ Generate Langkah Kegiatan & Pertanyaan Pemantik';
    }
  },

  renderHasilAI: function(data) {
    const hasilDiv = document.getElementById('hasilModulAjar');
    
    let html = `
      <div class="card" style="margin-bottom: 16px; border-color: var(--success);">
        <div class="card-header">
          <div class="card-title" style="color: var(--success);">✅ HASIL GENERATE AI</div>
          <div style="display:flex; gap:8px;">
             <button class="btn btn-primary btn-sm" onclick="window.ModulPerencanaan.saveModul()">💾 Ajukan Pengesahan</button>
             <button class="btn btn-ghost btn-sm" onclick="CimegaUtils.copyToClipboard('modulAjarContent')">Salin</button>
          </div>
        </div>
        <div class="card-body" id="modulAjarContent">
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
      document.getElementById('hasilModulAjar').style.display = 'none';
    } catch (e) {
      showToast('error', 'Gagal', e.message);
    }
  }
};
