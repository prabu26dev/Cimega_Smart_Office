/**
 * =============================================================
 * CIMEGA SMART OFFICE — Dynamic AI Generator Modal UI
 * FILE    : GeneratorModal.js
 * DESKRIPSI: UI Modal yang memuat parameter secara dinamis dari Firestore
 * =============================================================
 */

window.CimegaGeneratorModal = {
  /**
   * Menampilkan modal generator
   */
  show: function(role, adminType, onFinalSave) {
    this.role      = role;
    this.adminType = adminType;
    this.onSave    = onFinalSave;

    // 1. Ambil Template dari Cache Dashboard
    this.template = window.CimegaDashboard.templates.find(t => 
      t.role === role && t.adminType === adminType
    );

    if (!this.template) {
      alert('Template tidak ditemukan di database.');
      return;
    }

    // 2. Buat Style (Premium Design)
    if (!document.getElementById('cimega-gen-css')) {
      const style = document.createElement('style');
      style.id = 'cimega-gen-css';
      style.innerHTML = `
        .gen-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; font-family: 'Exo 2', sans-serif; }
        .gen-modal { width: 500px; background: #0d1117; border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 20px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; }
        .gen-header { text-align: center; margin-bottom: 25px; }
        .gen-title { font-family: 'Orbitron'; color: #ffd700; font-size: 16px; margin-bottom: 8px; }
        .gen-sub { font-size: 12px; color: #8b949e; }
        
        .gen-form { display: grid; gap: 15px; margin-bottom: 25px; max-height: 400px; overflow-y: auto; padding-right: 10px; }
        .gen-form::-webkit-scrollbar { width: 4px; }
        .gen-form::-webkit-scrollbar-thumb { background: #ffd700; border-radius: 10px; }
        
        .gen-field { display: flex; flex-direction: column; gap: 5px; }
        .gen-field label { font-size: 11px; color: #58a6ff; font-weight: 700; text-transform: uppercase; }
        .gen-field input, .gen-field select, .gen-field textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; color: #fff; font-size: 13px; outline: none; transition: 0.3s; }
        .gen-field input:focus { border-color: #ffd700; background: rgba(255,255,255,0.08); }

        .gen-progress-box { display: none; margin-top: 20px; }
        .gen-status { font-size: 12px; color: #ffd700; margin-bottom: 8px; display: flex; justify-content: space-between; }
        .gen-bar-bg { height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
        .gen-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #ffd700, #ff8800); transition: width 0.4s cubic-bezier(0.1, 0.8, 0.2, 1); }
        .gen-bar-fill.error { background: #ff4466; box-shadow: 0 0 10px #ff4466; }

        .gen-actions { display: flex; gap: 10px; margin-top: 10px; }
        .gen-btn { flex: 1; padding: 12px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; font-family: 'Orbitron'; font-size: 11px; transition: 0.3s; }
        .gen-btn-primary { background: #ffd700; color: #000; }
        .gen-btn-primary:hover { background: #fff; transform: translateY(-2px); }
        .gen-btn-cancel { background: rgba(255,255,255,0.05); color: #8b949e; }
      `;
      document.head.appendChild(style);
    }

    this.render();
  },

  /**
   * Render Modal ke DOM
   */
  render: function() {
    const fields = this.template.components || [];
    
    const overlay = document.createElement('div');
    overlay.className = 'gen-overlay';
    overlay.id = 'genOverlay';
    
    overlay.innerHTML = `
      <div class="gen-modal" id="genModal">
        <div class="gen-header">
          <div class="gen-title">🤖 AI ADMIN GENERATOR</div>
          <div class="gen-sub">Otomasi ${this.template.nama} via Dynamic Control Center</div>
        </div>

        <div class="gen-form" id="genForm">
          ${fields.map(f => `
            <div class="gen-field">
              <label>${f.label}</label>
              ${f.type === 'select' 
                ? `<select id="field-${f.id}">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`
                : `<input type="${f.type || 'text'}" id="field-${f.id}" placeholder="${f.placeholder || ''}">`
              }
            </div>
          `).join('')}
        </div>

        <div class="gen-progress-box" id="genProgressBox">
          <div class="gen-status">
            <span id="genStatusText">Menghubungkan ke database...</span>
            <span id="genPercentText">0%</span>
          </div>
          <div class="gen-bar-bg">
            <div class="gen-bar-fill" id="genBarFill"></div>
          </div>
        </div>

        <div class="gen-actions">
          <button class="gen-btn gen-btn-cancel" onclick="CimegaGeneratorModal.close()">BATAL</button>
          <button class="gen-btn gen-btn-primary" id="btnGenerate">MULAI GENERATE</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('btnGenerate').onclick = () => this.startGeneration();
  },

  /**
   * Menjalankan proses Generator
   */
  startGeneration: function() {
    const params = {};
    const inputs = document.querySelectorAll('#genForm input, #genForm select');
    inputs.forEach(el => {
      params[el.id.replace('field-', '')] = el.value;
    });

    // Validasi
    if (Object.values(params).some(v => !v)) {
      alert('Mohon lengkapi semua parameter!');
      return;
    }

    // UI Feedback
    document.getElementById('genForm').style.display        = 'none';
    document.getElementById('genProgressBox').style.display = 'block';
    document.getElementById('btnGenerate').disabled         = true;
    document.getElementById('btnGenerate').innerText        = 'PROCESS...';

    // Panggil Service AI
    window.CimegaAIGenerator.generate({
      role: this.role,
      adminType: this.adminType,
      params: params,
      onProgress: (pct, status) => {
        const fill = document.getElementById('genBarFill');
        const stat = document.getElementById('genStatusText');
        const perc = document.getElementById('genPercentText');
        if (fill) fill.style.width = pct + '%';
        if (stat) stat.innerText    = status;
        if (perc) perc.innerText    = pct + '%';
      },
      onSuccess: (data) => {
        setTimeout(() => {
          if (this.onSave) this.onSave(data);
          alert('Berhasil! Administrasi dinamis telah ter-generate.');
          this.close();
        }, 1000);
      },
      onError: (msg) => {
        const fill = document.getElementById('genBarFill');
        if (fill) fill.classList.add('error');
        alert('Gagal Generate: ' + msg);
        this.close();
      }
    });
  },

  close: function() {
    const el = document.getElementById('genOverlay');
    if (el) el.remove();
    if (window.CimegaAIGenerator) window.CimegaAIGenerator.cancel();
  }
};
