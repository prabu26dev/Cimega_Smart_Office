/**
 * =============================================================
 * CIMEGA SMART OFFICE — Dynamic Dashboard UI Manager
 * FILE    : dashboard_ui.js
 * DESKRIPSI: Merender Sidebar & Dashboard secara dinamis dari Firestore
 * =============================================================
 */

window.CimegaDashboard = {
  templates: [],
  userData: {},
  userRoles: [],

  // ── 1. INISIALISASI ─────────────────────────────────────────

  async init(navCallback) {
    this.navCallback = navCallback;
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    this.userRoles = this.userData.roles || [this.userData.role || 'guru'];

    // Tampilkan Loading State
    this.showLoading();

    try {
      await this.fetchTemplates();
      this.renderSidebar();
      this.renderHome();
      this.injectStyles();
    } catch (e) {
      console.error('Dashboard Init Error:', e);
    }
  },

  showLoading() {
    const nav = document.querySelector('.sidebar-nav');
    if (nav) nav.innerHTML = '<div style="padding:20px;color:var(--muted);font-size:12px">Sinkronisasi data...</div>';
  },

  // ── 2. DATA FETCHING (FIRESTORE) ───────────────────────────

  async fetchTemplates() {
    const { collection, getDocs, query, where, orderBy } = window._fb;
    const db = window._fb.db;

    // Ambil semua template yang relevan dengan role user
    const q = query(
      collection(db, 'admin_templates'),
      where('role', 'in', this.userRoles)
    );

    const snapshot = await getDocs(q);
    this.templates = [];
    snapshot.forEach(doc => {
      this.templates.push({ id: doc.id, ...doc.data() });
    });

    console.log(`📊 Dashboard: Berhasil memuat ${this.templates.length} template dinamis.`);
  },

  // ── 3. RENDER SIDEBAR ──────────────────────────────────────

  renderSidebar() {
    const navContainer = document.querySelector('.sidebar-nav');
    if (!navContainer) return;

    let html = '';
    
    // Beranda selalu di atas
    html += `<div class="nav-item active" id="nav-home" onclick="CimegaDashboard.nav('home', this)">🏠 Beranda</div>`;

    // Grouping berdasarkan kategori
    const categories = {
      'perencanaan': '📋 PERENCANAAN',
      'pelaksanaan': '🏫 PELAKSANAAN',
      'penilaian': '📊 PENILAIAN',
      'tata_usaha': '✉️ TATA USAHA',
      'keuangan': '💰 KEUANGAN',
      'kepsek_manajerial': '🏛️ MANAJERIAL'
    };

    // Render Menu berdasarkan Template
    this.templates.forEach(tmp => {
      const sectionName = categories[tmp.kategori] || '📁 LAINNYA';
      
      // Cek apakah section sudah ada
      if (!html.includes(sectionName)) {
        html += `<div class="nav-section">${sectionName}</div>`;
      }

      html += `
        <div class="nav-item" id="nav-${tmp.adminType}" onclick="CimegaDashboard.nav('${tmp.adminType}', this, '${tmp.id}')">
          ${tmp.icon || '📄'} ${tmp.nama}
        </div>
      `;
    });

    // Menu Interaksi & AI (Common)
    html += `<div class="nav-section">Interaksi & AI</div>`;
    html += `<div class="nav-item" id="nav-chat" onclick="CimegaDashboard.nav('chat', this)">💬 Chat Sekolah</div>`;
    html += `<div class="nav-item" id="nav-ai" onclick="CimegaDashboard.nav('ai', this)">🤖 AI Co-Pilot</div>`;
    html += `<div class="nav-item" id="nav-sharing" onclick="CimegaDashboard.nav('sharing', this)">📩 Berbagi Dokumen</div>`;

    navContainer.innerHTML = html;
  },

  // ── 4. RENDER HOME (QUICK ACTIONS) ──────────────────────────

  renderHome() {
    const homeContainer = document.getElementById('page-home');
    if (!homeContainer) return;

    let actionCards = '';
    const colors = [
      'linear-gradient(135deg, #0066ff, #00aaff)',
      'linear-gradient(135deg, #00cc88, #00ffaa)',
      'linear-gradient(135deg, #aa55ff, #6600ff)',
      'linear-gradient(135deg, #ff8800, #ffaa00)',
      'linear-gradient(135deg, #e040fb, #9c27b0)',
      'linear-gradient(135deg, #ff4466, #ff6688)'
    ];

    this.templates.slice(0, 6).forEach((tmp, index) => {
      actionCards += `
        <div class="action-card" onclick="CimegaDashboard.nav('${tmp.adminType}', document.getElementById('nav-${tmp.adminType}'), '${tmp.id}')">
          <div class="ac-icon" style="background:${colors[index % colors.length]}">${tmp.icon || '📄'}</div>
          <div class="ac-info">
            <div class="ac-label">${tmp.nama}</div>
            <div class="ac-desc">Klik untuk generate administrasi ${tmp.nama} secara otomatis.</div>
          </div>
          <div class="ac-arrow">→</div>
        </div>
      `;
    });

    homeContainer.innerHTML = `
      <div class="dashboard-home">
        <div class="home-hero">
          <div class="hero-text">
            <h1>Selamat Datang, <span>${this.userData.nama || 'User'}</span>!</h1>
            <p>Admin Control Center telah mengaktifkan ${this.templates.length} fitur dinamis untuk Anda.</p>
          </div>
          <div class="hero-stats">
             <div class="h-stat"><strong>${this.userRoles.join(' & ')}</strong></div>
             <div class="h-stat"><strong>${new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long'})}</strong></div>
          </div>
        </div>
        
        <h2 class="section-title">Akses Cepat (Quick Actions) — Dinamis</h2>
        <div class="action-grid">
          ${actionCards}
        </div>
      </div>
    `;
  },

  // ── 5. NAVIGATION & DYNAMIC PAGE HANDLING ──────────────────

  nav(pageId, el, templateId) {
    if (!el) return;
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    
    // Switch Page
    document.querySelectorAll('.guru-module-page, .page').forEach(e => e.classList.remove('active'));
    
    // Jika templateId ada, berarti ini modul dinamis
    if (templateId) {
      this.renderDynamicPage(templateId);
    } else {
      const target = document.getElementById('page-' + pageId);
      if (target) target.classList.add('active');
    }

    if (this.navCallback) this.navCallback(pageId);
  },

  renderDynamicPage(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    // Gunakan kontainer 'page-dynamic' (pastikan ada di HTML)
    let page = document.getElementById('page-dynamic');
    if (!page) {
      page = document.createElement('div');
      page.id = 'page-dynamic';
      page.className = 'page';
      document.querySelector('.main-content').appendChild(page);
    }

    page.innerHTML = `
      <div class="module-header">
        <div class="module-title-box">
          <div class="module-icon">${template.icon || '📄'}</div>
          <div>
            <h1 class="module-title">${template.nama.toUpperCase()}</h1>
            <p class="module-subtitle">Administrasi Otomatis berbasis Firestore & Gemini AI</p>
          </div>
        </div>
        <button class="btn btn-gold" onclick="CimegaAI.openGenerator('${template.role}', '${template.adminType}')">
          ✨ Generate dengan AI
        </button>
      </div>

      <div class="module-card">
        <h3 style="color:var(--cyan); margin-bottom:15px">Panduan Pengisian</h3>
        <p style="color:var(--muted); font-size:13px">
          Pusat Kontrol Admin telah mengonfigurasi modul ini. Anda dapat menekan tombol 
          <strong>Generate</strong> untuk memulai proses pembuatan dokumen secara otomatis 
          berdasarkan parameter yang telah ditentukan oleh Admin Sekolah.
        </p>
      </div>
    `;
    
    page.classList.add('active');
  },

  injectStyles() {
    // Re-use current styles or inject new ones if needed
  }
};
