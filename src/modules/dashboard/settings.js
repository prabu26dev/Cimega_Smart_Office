'use strict';
// ══════════════════════════════════════════
// DASHBOARD — CIMEGA SMART OFFICE
// Versi: Role Bendahara Integrated
// ══════════════════════════════════════════

let db, userData;
let pageHistory = [], currentKat = '', currentDocId = '', currentDocName = '';
let allShared = [], allApprovals = [], currentShareDocId = '';
let pageSettings = { size: 'A4', margin: 'Normal', orientation: 'Portrait' };
let _kontenCache = {}, _menuDataDynamic = [];

userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
console.log('Settings: User data loaded', userData);

if (!userData?.role || userData.role === 'admin') {
  console.warn('Settings: User role invalid or admin, redirecting...');
  // Only redirect if NOT in a dev environment OR if it's clear we have no data
  if (!userData?.nama) {
     window.location.href = '../login/login.html';
  }
}

// Normalize roles
if (!userData.roles) {
  userData.roles = userData.role ? [userData.role.toLowerCase()] : ['guru'];
} else if (!Array.isArray(userData.roles)) {
  userData.roles = [userData.roles.toLowerCase()];
} else {
  userData.roles = userData.roles.map(r => r.toLowerCase());
}
window._userData = userData; // Global access

let _chatUnsub = null, _sharedUnsub = null;

function filterAiTabsByRole() {
  // Implement role-based AI tab visibility if needed in the future
  const roles = userData.roles;
  // Currently, the AI section in dashboard.html only contains one panel (Chatbot).
  // This function is defined to satisfy calls in loadKontenDynamic.
}

// ── Kategori meta ──────────────────────────
const katMeta = {
  adm_guru: { icon: '📚', title: 'Administrasi Guru & Pembelajaran', desc: 'RPP, Modul Ajar, Penilaian, Jurnal' },
  adm_kepsek: { icon: '🏛️', title: 'Administrasi Kepala Sekolah', desc: 'Tugas Pokok, Supervisi, Manajerial, Humas' },
  kosp: { icon: '📋', title: 'Kurikulum Operasional Satuan Pendidikan', desc: 'Karakteristik, Visi Misi, Perencanaan' },
  adm_umum: { icon: '🏫', title: 'Administrasi Umum Sekolah', desc: 'SK, Inventaris, Jadwal, Tata Tertib' },
  keuangan: { icon: '💰', title: 'Keuangan & BOS', desc: 'Laporan BOS, RKAS, BKU, LPJ, Nota' },
  evaluasi: { icon: '📊', title: 'Evaluasi & Pelaporan Sekolah', desc: 'EDS, Akreditasi, Supervisi, Monev' },
  perpus: { icon: '📖', title: 'Administrasi Perpustakaan Lengkap', desc: 'Keanggotaan, Peminjaman, Keuangan' },
};

// Kategori per role — urutan standar global
const katByRole = {
  guru: ['adm_guru', 'adm_umum', 'evaluasi', 'perpus'],
  kepsek: ['adm_guru', 'adm_kepsek', 'kosp', 'adm_umum', 'keuangan', 'evaluasi', 'perpus'],
  bendahara: ['keuangan', 'evaluasi'],
  ops: ['adm_umum', 'keuangan', 'evaluasi', 'perpus'],
};

const KAT_ORDER = ['adm_guru', 'adm_kepsek', 'kosp', 'adm_umum', 'keuangan', 'evaluasi', 'perpus'];

function getOrderedKats(roles) {
  const merged = new Set();
  roles.forEach(r => { (katByRole[r] || []).forEach(k => merged.add(k)); });
  return KAT_ORDER.filter(k => merged.has(k));
}

// ── Load konten dari Firestore (Real-time) ──────────
let _kontenUnsub = null;
let _katUnsub = null;

function loadKontenDynamic() {
  const { collection, onSnapshot, query, orderBy, where } = window._fb;
  const roles = userData.roles || ['guru'];
  const sekolah = userData.sekolah;
  
  if (_kontenUnsub) _kontenUnsub();
  if (_katUnsub) _katUnsub();
  if (_chatUnsub) _chatUnsub();
  if (_sharedUnsub) _sharedUnsub();

  let katLoaded = false;
  let kontenLoaded = false;

  const tryRefresh = () => {
    if (katLoaded && kontenLoaded) refreshDashboardUI();
  };

  // 1. Listen Kategori — simpan visibleTo agar sidebar mengikuti konfigurasi admin
  _katUnsub = onSnapshot(query(collection(db, 'kategori'), orderBy('urutan', 'asc')), snap => {
    snap.forEach(d => {
      const data = d.data();
      katMeta[d.id] = { 
        icon: data.icon || '📄', 
        title: data.nama, 
        desc: data.deskripsi || '',
        urutan: data.urutan || 99,
        visibleTo: data.visibleTo || [] // Simpan konfigurasi visibleTo dari Firestore
      };
    });
    katLoaded = true;
    console.log(`Settings: Kategori loaded (${snap.size} items)`);
    tryRefresh();
  }, err => { 
    console.warn("Kat Listener error:", err); 
    katLoaded = true; tryRefresh(); 
  });

  // 2. Listen Konten
  _kontenUnsub = onSnapshot(collection(db, 'konten'), snap => {
    const byKat = {};
    snap.forEach(d => {
      const data = d.data();
      const visible = data.visibleTo || ['guru', 'kepsek', 'bendahara', 'ops'];
      const canSee = roles.some(r => visible.includes(r));
      if (!canSee) return;
      if (!byKat[data.kategori]) byKat[data.kategori] = [];
      byKat[data.kategori].push({ id: d.id, nama: data.nama, ...data });
    });
    _kontenCache = byKat;
    kontenLoaded = true;
    console.log(`Settings: Konten cache updated (${snap.size} docs total)`);
    tryRefresh();
  }, err => {
    console.warn("Konten Listener error:", err);
    kontenLoaded = true; tryRefresh();
  });

  // 3. Listen Shared Docs (Real-time) — dengan error handler agar tidak crash jika sekolah kosong
  if (sekolah) {
    _sharedUnsub = onSnapshot(
      query(collection(db, 'shared_docs'), where('sekolah', '==', sekolah), orderBy('sharedAt', 'desc')),
      snap => {
        allShared = [];
        snap.forEach(d => allShared.push({ id: d.id, ...d.data() }));
        const sharedPage = document.getElementById('page-shared');
        if (sharedPage && sharedPage.classList.contains('active')) renderShared('all');
      },
      err => { console.warn('SharedDocs listener error (non-fatal):', err.message); }
    );
  }
}

function refreshDashboardUI() {
  const roles = userData.roles || ['guru'];

  // Build kategori order dari Firestore visibleTo (bukan hardcoded)
  const allKatIds = Object.keys(katMeta)
    .sort((a, b) => (katMeta[a].urutan || 99) - (katMeta[b].urutan || 99));

  const ordered = allKatIds.filter(katId => {
    const vt = katMeta[katId].visibleTo;
    if (!vt || vt.length === 0) return true; // Tidak ada restriksi = dapat dilihat semua
    return roles.some(r => vt.includes(r));
  });

  _menuDataDynamic = [];
  
  // 1. Tambahkan kategori yang ada di katMeta
  ordered.forEach(katId => {
    const meta = katMeta[katId];
    const docs = _kontenCache[katId] || [];
    if (meta) {
      _menuDataDynamic.push({
        id: katId,
        icon: meta.icon || '📄',
        title: meta.title || katId,
        desc: meta.desc || '',
        items: docs.map(d => d.nama),
        docs: docs
      });
    }
  });

  // 2. Fallback: Tambahkan kategori kustom yang ada di konten tapi tidak ada di kategori
  Object.keys(_kontenCache).forEach(katId => {
    if (!ordered.includes(katId) && !katMeta[katId]) {
      const docs = _kontenCache[katId] || [];
      if (docs.length > 0) {
        // Cek permission dari dokumen pertama di kategori ini
        const d = docs[0];
        const visible = d.visibleTo || ['guru', 'kepsek', 'bendahara', 'ops'];
        const canSee = roles.some(r => visible.includes(r));
        if (canSee) {
          _menuDataDynamic.push({
            id: katId,
            icon: '📁',
            title: katId.replace(/_/g, ' ').toUpperCase(),
            desc: 'Kategori Kustom',
            items: docs.map(d => d.nama),
            docs: docs
          });
        }
      }
    }
  });

  buildSidebar();
  
  // UI Sync
  if (document.getElementById('page-beranda')?.classList.contains('active')) loadBeranda();
  if (document.getElementById('page-menu')?.classList.contains('active')) renderMenuGrid(_menuDataDynamic);
  
  filterAiTabsByRole();
}

// ── Clock ──────────────────────────────────
setInterval(() => {
  const el = document.getElementById('topbarTime');
  if (el) el.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}, 1000);

// ── Toast ──────────────────────────────────
function showToast(type, title, msg) {
  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `<span style="font-size:16px">${icons[type] || 'ℹ️'}</span><div><strong style="display:block;margin-bottom:1px">${title}</strong>${msg || ''}</div>`;
  const wrap = document.getElementById('toastWrap');
  if (wrap) {
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }
}
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }
function openModal(id) { document.getElementById(id)?.classList.add('show'); }

// ── Navigation ─────────────────────────────
function showPage(id, title) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  const tt = document.getElementById('topbarTitle');
  if (tt) tt.textContent = title || id.toUpperCase();
}
function goBack() {
  if (pageHistory.length > 0) { const p = pageHistory.pop(); showPage(p.id, p.title); }
  else showPage('beranda', 'BERANDA');
}
function goBackToList() { showPage('doclist', 'DAFTAR DOKUMEN'); }

// ── Sidebar ────────────────────────────────
function buildSidebar() {
  const roles = userData.roles || ['guru'];
  let html = `<div class="nav-section">Menu Utama</div>
<div class="nav-item active" id="nav-beranda" onclick="navTo(this,'beranda','BERANDA',loadBeranda)"><span class="nav-icon">🏠</span>Beranda</div>`;

  if (_menuDataDynamic.length > 0) {
    html += `<div class="nav-section">Administrasi Digital</div>`;
    _menuDataDynamic.forEach(m => {
      html += `<div class="nav-item" onclick="navToMenu(this,'${m.id}')"><span class="nav-icon">${m.icon}</span><span style="flex:1;font-size:11px;line-height:1.2">${m.title}</span></div>`;
    });
  }

  html += `<div class="nav-section">Kolaborasi</div>
<div class="nav-item" onclick="navTo(this,'shared','DOKUMEN BERSAMA',()=>renderShared('all'))"><span class="nav-icon">📤</span>Dok. Bersama</div>
<div class="nav-item" onclick="navTo(this,'chat','CHAT SEKOLAH',()=>window.CimegaChat.init(db,'page-chat'))"><span class="nav-icon">💬</span>Chat Sekolah</div>`;

  if (roles.includes('kepsek')) {
    html += `<div class="nav-section">Pantauan & Validasi</div>
    <div class="nav-item" onclick="navTo(this,'monitor','MONITOR GURU',loadMonitor)"><span class="nav-icon">👁️</span>Monitor Guru</div>
    <div class="nav-item" onclick="navTo(this,'validasi','VALIDASI DOKUMEN',()=>loadApprovals('pending'))"><span class="nav-icon">✅</span>Validasi Dok.<span class="nav-badge" id="approvalBadge" style="display:none">!</span></div>
    <div class="nav-item" onclick="navTo(this,'rekap','REKAP DOKUMEN',loadRekap)"><span class="nav-icon">📊</span>Rekap Dokumen</div>`;
  }
  
  if (roles.includes('guru') || roles.includes('bendahara') || roles.includes('ops')) {
     html += `<div class="nav-item" onclick="navTo(this,'approval-guru','DIKIRIM KE KEPSEK',loadMySubmissions)"><span class="nav-icon">📬</span>Kiriman Saya<span class="nav-badge" id="submBadge" style="display:none">!</span></div>`;
  }

  html += `<div class="nav-section">Fitur AI</div>
<div class="nav-item" onclick="navTo(this,'ai','AI ASISTEN',()=>window.CimegaAIChatbot.renderTo('aiPanel-chat'))"><span class="nav-icon">✨</span>AI Asisten</div>
<div class="nav-section">Lainnya</div>
<div class="nav-item" onclick="navTo(this,'profil','PROFIL SAYA',loadProfil)"><span class="nav-icon">👤</span>Profil Saya</div>`;
  
  const sidebar = document.getElementById('sidebarNav');
  if (sidebar) sidebar.innerHTML = html;
}
function navTo(el, pageId, title, fn) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  pageHistory = [];
  showPage(pageId, title);
  if (fn) fn();
}
function navToMenu(el, menuId) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  pageHistory = [];
  renderMenuGrid(_menuDataDynamic, menuId);
  showPage('menu', 'ADMINISTRASI');
}

// ── setupUser ──────────────────────────────
function setupUser() {
  const roles = userData.roles || ['guru'];
  
  // Sidebar Identity
  const elSidebarNama = document.getElementById('sidebarNama');
  if (elSidebarNama) elSidebarNama.textContent = userData.nama || '-';
  
  const elSidebarSekolah = document.getElementById('sidebarSekolah');
  if (elSidebarSekolah) elSidebarSekolah.textContent = userData.sekolah || '-';

  const roleMap = {
    guru: { cls: 'role-guru', label: '👨‍🏫 Guru' },
    kepsek: { cls: 'role-kepsek', label: '🏛️ Kepsek' },
    bendahara: { cls: 'role-bendahara', label: '💰 Bendahara' },
    ops: { cls: 'role-ops', label: '💻 Operator' },
  };
  
  const rb = document.getElementById('sidebarRole');
  if (rb) {
    if (roles.length === 1) {
      const r = roleMap[roles[0]] || { cls: 'role-guru', label: roles[0] };
      rb.className = 'user-role-badge ' + r.cls;
      rb.textContent = r.label;
    } else {
      rb.className = 'user-role-badge role-guru';
      rb.textContent = roles.map(r => roleMap[r]?.label || r).join(' · ');
    }
  }

  // Topbar & Branding
  const elSchoolName = document.getElementById('schoolName');
  if (elSchoolName) elSchoolName.textContent = userData.sekolah || 'SDN Cimega';
  
  const elSchoolAddr = document.getElementById('schoolAddr');
  if (elSchoolAddr && userData.alamat) elSchoolAddr.textContent = userData.alamat;

  // Beranda Welcome Card
  const elWelcomeName = document.getElementById('welcomeName');
  if (elWelcomeName) elWelcomeName.textContent = 'Selamat Datang, ' + (userData.nama || 'User') + '!';
  
  const elWelcomeSub = document.getElementById('welcomeSub');
  if (elWelcomeSub) elWelcomeSub.textContent = userData.sekolah || 'Sistem Administrasi Digital';

  const elWelcomeDate = document.getElementById('welcomeDate');
  if (elWelcomeDate) {
    const now = new Date();
    const tgl = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    elWelcomeDate.innerHTML = `${tgl}<br/><span style="font-size:10px;color:var(--cyan)">${jam} WIB</span>`;
  }
}

// ── Menu Grid ──────────────────────────────
function renderMenuGrid(menus, targetKatId = null) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  // Jika targetKatId disediakan, langsung buka daftar dokumen
  if (targetKatId) {
    const found = menus.find(m => m.id === targetKatId);
    if (found) {
      openDocList(targetKatId);
      return;
    }
  }

  const isBendahara = (userData.roles || []).includes('bendahara');
  grid.innerHTML = menus.map(m => `
  <div class="menu-card${isBendahara && m.id === 'keuangan' ? ' keuangan-highlight' : ''}"
    onclick="openDocList('${m.id}')">
    <div class="menu-card-count">${m.items.length}</div>
    <div class="menu-card-icon">${m.icon}</div>
    <div class="menu-card-title">${m.title}</div>
    <div class="menu-card-desc">${m.desc}</div>
  </div>`).join('');
}

// ── Doc list ───────────────────────────────
function openDocList(katId) {
  const menu = _menuDataDynamic.find(m => m.id === katId);
  if (!menu) { console.warn('openDocList: kategori tidak ditemukan →', katId); return; }
  const katTitle = menu.title;
  const items = menu.items;
  currentKat = katId;
  pageHistory.push({ id: 'menu', title: 'ADMINISTRASI' });
  const icons = ['📄', '📝', '📋', '🗒️', '📃', '📑', '🗃️'];
  const titleEl = document.getElementById('doclistTitle');
  if (titleEl) titleEl.innerHTML = `<span>${katTitle.split(' ').slice(0, 3).join(' ')}</span>`;
  const subEl = document.getElementById('doclistSub');
  if (subEl) subEl.textContent = katTitle + ' · ' + items.length + ' dokumen';
  const grid = document.getElementById('docGrid');
  if (grid) {
    if (items.length === 0) {
      grid.innerHTML = `
        <div style="text-align:center;padding:60px 20px;color:var(--muted)">
          <div style="font-size:48px;margin-bottom:16px">📄</div>
          <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:8px">${katTitle}</div>
          <div style="font-size:12px;line-height:1.6">Belum ada dokumen tersedia untuk kategori ini.<br>
          Hubungi administrator untuk menambahkan dokumen.</div>
        </div>`;
    } else {
      grid.innerHTML = items.map((name, i) => `
  <div class="doc-item" onclick="openDoc('${katId}','${name.replace(/'/g, "\\'")}')">
    <div class="doc-item-icon">${icons[i % icons.length]}</div>
    <div style="flex:1;min-width:0">
      <div class="doc-item-name">${name}</div>
      <div class="doc-item-meta">${katTitle}</div>
    </div>
    <span style="color:var(--muted);font-size:11px">▶</span>
  </div>`).join('');
    }
  }
  showPage('doclist', 'DAFTAR DOKUMEN');
}

// ── Buka dokumen ───────────────────────────
async function openDoc(katId, docName) {
  currentKat = katId; currentDocName = docName; currentDocId = '';
  pageHistory.push({ id: 'doclist', title: 'DAFTAR DOKUMEN' });
  const titleEl = document.getElementById('docviewTitle');
  if (titleEl) titleEl.textContent = docName;
  const metaEl = document.getElementById('docviewMeta');
  if (metaEl) metaEl.textContent = katId + ' · ' + pageSettings.size + ' ' + pageSettings.orientation;
  const infoEl = document.getElementById('pageInfoLabel');
  if (infoEl) infoEl.textContent = pageSettings.size + ' | ' + pageSettings.margin + ' | ' + pageSettings.orientation;
  const contentEl = document.getElementById('docContent');
  if (contentEl) {
    contentEl.contentEditable = 'false';
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.style.display = 'none';
    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.textContent = '✏️ Edit';
    contentEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--muted)"><div class="spinner"></div></div>';
    showPage('docview', docName);
    try {
      const { collection, query, where, getDocs } = window._fb;
      const snap = await getDocs(query(collection(db, 'konten'), where('kategori', '==', katId), where('nama', '==', docName)));
      if (!snap.empty) {
        const d = snap.docs[0]; currentDocId = d.id;
        const data = d.data();
        const savedContent = data.savedContentByUser?.[userData.id] || data.savedContent || null;
        contentEl.innerHTML = savedContent || data.template?.replace(/\n/g, '<br/>') ||
          `<div style="color:var(--muted);text-align:center;padding:36px"><div style="font-size:36px;margin-bottom:12px">📄</div><div style="font-size:13px;color:var(--text);margin-bottom:6px">${docName}</div><div>Template belum diisi admin. Klik <strong>Edit</strong> untuk mulai menulis.</div></div>`;
      } else {
        contentEl.innerHTML = `<div style="color:var(--muted);text-align:center;padding:36px"><div style="font-size:36px;margin-bottom:12px">📄</div><div>Konten belum tersedia dari admin.</div></div>`;
      }
    } catch (e) { contentEl.innerHTML = '<div style="color:var(--muted);text-align:center;padding:30px">Gagal memuat.</div>'; }
  }
}

// ── Edit & Save ────────────────────────────
function toggleEdit() {
  const ce = document.getElementById('docContent');
  if (!ce) return;
  const editing = ce.contentEditable === 'true';
  const saveBtn = document.getElementById('saveBtn');
  const editBtn = document.getElementById('editBtn');
  if (editing) {
    ce.contentEditable = 'false';
    if (saveBtn) saveBtn.style.display = 'none';
    if (editBtn) editBtn.textContent = '✏️ Edit';
  } else {
    ce.contentEditable = 'true';
    ce.focus();
    if (saveBtn) saveBtn.style.display = 'inline-flex';
    if (editBtn) editBtn.textContent = '✕ Batal';
  }
}
async function saveDoc() {
  if (!currentDocId) { showToast('warn', 'Perhatian', 'Dokumen belum ada di database. Hubungi admin.'); return; }
  const { doc, updateDoc, serverTimestamp } = window._fb;
  const contentEl = document.getElementById('docContent');
  if (!contentEl) return;
  const content = contentEl.innerHTML;
  try {
    const field = `savedContentByUser.${userData.id}`;
    await updateDoc(doc(db, 'konten', currentDocId), { [field]: content, updatedAt: serverTimestamp() });
    toggleEdit();
    showToast('success', 'Tersimpan', 'Dokumen berhasil disimpan');
  } catch (e) { showToast('error', 'Gagal', e.message); }
}
function fmt(cmd) { document.execCommand(cmd, false, null); }

// ── Download & Print ───────────────────────
function downloadDoc() {
  const contentEl = document.getElementById('docContent');
  if (!contentEl) return;
  const content = contentEl.innerHTML;
  const title = currentDocName || 'Dokumen';
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;color:#000;padding:2cm;max-width:21cm;margin:0 auto}</style>
</head><body><h2 style="font-family:Arial">${title}</h2><hr/>${content}</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = title + '.html'; a.click();
  URL.revokeObjectURL(url);
  showToast('success', 'Diunduh', title + ' berhasil diunduh');
}
function printDoc() {
  const contentEl = document.getElementById('docContent');
  if (!contentEl) return;
  const content = contentEl.innerHTML;
  const title = currentDocName || 'Dokumen';
  const w = window.open('', '_blank');
  const margins = { Normal: '2.54cm', Moderate: '1.91cm', Narrow: '1.27cm' };
  const mg = margins[pageSettings.margin] || '2.54cm';
  const sz = pageSettings.size === 'F4' ? '21.59cm 33.02cm' : 'A4';
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>@page{size:${sz};margin:${mg}}body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;color:#000}</style>
</head><body>${content}</body></html>`);
  w.document.close(); setTimeout(() => { w.print(); w.close(); }, 400);
}

// ── Page settings ──────────────────────────
function setPageSize(s) {
  pageSettings.size = s;
  ['A4', 'F4'].forEach(k => document.getElementById('ps' + k)?.classList.toggle('active', k === s));
  showToast('info', 'Ukuran Kertas', 'Diatur ke ' + s);
}
function setMargin(m) {
  pageSettings.margin = m;
  ['Normal', 'Moderate', 'Narrow'].forEach(k => document.getElementById('ps' + k)?.classList.toggle('active', k === m));
  showToast('info', 'Margin', 'Diatur ke ' + m);
}
function setOrientation(o) {
  pageSettings.orientation = o;
  ['Portrait', 'Landscape'].forEach(k => document.getElementById('ps' + k)?.classList.toggle('active', k === o));
  showToast('info', 'Orientasi', 'Diatur ke ' + o);
}

function createSharedDoc() {
  const docName = prompt("Masukkan Nama Dokumen / File Baru:");
  if (!docName) return;
  
  currentKat = 'umum'; 
  currentDocName = docName; 
  currentDocId = ''; // Tidak di-save ke konten, hanya untuk dishare
  
  pageHistory.push({ id: 'shared', title: 'DOKUMEN BERSAMA' });
  
  const titleEl = document.getElementById('docviewTitle');
  if (titleEl) titleEl.textContent = docName;
  const metaEl = document.getElementById('docviewMeta');
  if (metaEl) metaEl.textContent = 'Dokumen Baru Kustom · ' + pageSettings.size + ' ' + pageSettings.orientation;
  
  const contentEl = document.getElementById('docContent');
  if (contentEl) {
    contentEl.innerHTML = '<div style="padding:20px;color:var(--text);"><p>Mulai ketik dokumen Anda di sini, atau paste (Ctrl+V) teks/gambar dari luar...</p></div>';
    contentEl.contentEditable = 'true';
    
    // Hide save disabled message
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.style.display = 'none';
    
    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.textContent = '✕ Selesai Edit';
    
    showPage('docview', docName);
    setTimeout(() => contentEl.focus(), 300);
  }
}

// ── SHARE DOKUMEN ──────────────────────────
function openShareModal() {
  if (!currentDocName) {
    showToast('warn', 'Petunjuk', '💡 Buka dokumen dari menu Administrasi terlebih dahulu, lalu klik tombol 📤 Bagikan di halaman dokumen.');
    return;
  }
  const nameEl = document.getElementById('shareDocName');
  if (nameEl) nameEl.value = currentDocName;
  const targetSel = document.getElementById('shareTarget');
  if (targetSel) {
    const roles = userData.roles;
    let opts = '<option value="school">Semua di Sekolah</option>';
    if (roles.includes('kepsek')) {
      opts += '<option value="guru">Hanya Guru</option>';
      opts += '<option value="bendahara">Bendahara</option>';
      opts += '<option value="ops">Operator (OPS)</option>';
    } else {
      opts += '<option value="bendahara">Bendahara</option>';
      opts += '<option value="ops">Operator (OPS)</option>';
      opts += '<option value="kepsek">Kepala Sekolah (Pantau)</option>';
      opts += '<option value="approval">Kepala Sekolah (Minta Persetujuan)</option>';
    }
    targetSel.innerHTML = opts;
  }
  openModal('modalShare');
}
async function doShare() {
  const { collection, addDoc, serverTimestamp } = window._fb;
  const targetEl = document.getElementById('shareTarget');
  const noteEl = document.getElementById('shareNote');
  const contentEl = document.getElementById('docContent');
  if (!targetEl || !currentDocName || !contentEl) return;
  const target = targetEl.value;
  const note = noteEl?.value.trim() || '';
  const content = contentEl.innerHTML;
  try {
    const isApproval = target === 'approval';
    await addDoc(collection(db, 'shared_docs'), {
      docName: currentDocName, kategori: currentKat, content, note,
      sharedBy: userData.nama, sharedById: userData.id,
      sekolah: userData.sekolah, target,
      status: isApproval ? 'pending' : 'shared',
      sharedAt: serverTimestamp(), comments: [],
    });
    closeModal('modalShare');
    if (noteEl) noteEl.value = '';
    const msg = target === 'bendahara' ? `Dokumen dikirim ke Bendahara` :
      target === 'ops' ? `Dokumen dikirim ke Operator (OPS)` :
        target === 'approval' ? `Dikirim ke Kepsek untuk persetujuan` :
          target === 'kepsek' ? `Dibagikan ke Kepala Sekolah` :
            target === 'guru' ? `Dibagikan ke semua guru` :
              `Dibagikan ke semua di sekolah`;
    showToast('success', 'Terkirim!', msg);
  } catch (e) { showToast('error', 'Gagal', e.message); }
}

async function loadShared(filter = 'all') {
  renderShared(filter);
}
function filterShared(f) {
  ['all', 'school', 'mine'].forEach(k => {
    document.getElementById('sf' + k.charAt(0).toUpperCase() + k.slice(1))?.classList.toggle('active', k === f);
  });
  renderShared(f);
}
function renderShared(filter) {
  const gridEl = document.getElementById('sharedDocsGrid');
  if (!gridEl) return;
  const roles = userData.roles;
  let items = allShared;
  if (filter === 'school') items = allShared.filter(d => d.sharedById !== userData.id && d.target === 'school');
  if (filter === 'mine') items = allShared.filter(d => d.sharedById === userData.id);
  
  if (roles.includes('kepsek')) {
    items = allShared;
  } else if (roles.includes('bendahara')) {
    items = items.filter(d => d.target === 'bendahara' || d.target === 'school' || d.sharedById === userData.id);
  } else if (roles.includes('ops')) {
    items = items.filter(d => d.target === 'ops' || d.target === 'school' || d.sharedById === userData.id);
  } else {
    items = items.filter(d => d.target === 'school' || d.target === 'guru' || d.sharedById === userData.id);
  }
  
  if (items.length === 0) {
    const msg = filter === 'school' ? 'Belum ada dokumen dari rekan' : filter === 'mine' ? 'Anda belum membagikan dokumen' : 'Belum ada dokumen bersama';
    gridEl.innerHTML = `<div style="padding:40px;text-align:center;color:var(--muted);grid-column:1/-1">
      <div style="font-size:32px;margin-bottom:10px">📂</div>
      <p>${msg}</p>
    </div>`;
    return;
  }
  gridEl.innerHTML = items.map(d => `
<div class="card" style="padding:15px;cursor:pointer;transition:transform 0.2s" onclick="openSharedDocDetail('${d.id}','${(d.docName || '').replace(/'/g, "\\'")}','')">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
    <div style="width:36px;height:36px;border-radius:50%;background:rgba(0,229,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px">👤</div>
    <span class="badge badge-${d.status === 'shared' ? 'shared' : d.status === 'pending' ? 'pending' : d.status === 'approved' ? 'approved' : 'rejected'}">${d.status === 'shared' ? 'Shared' : d.status === 'pending' ? 'Pending' : d.status === 'approved' ? 'Approved' : 'Rejected'}</span>
  </div>
  <div style="font-weight:700;font-size:13px;color:#fff;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">📄 ${d.docName || '-'}</div>
  <div style="font-size:11px;color:var(--muted)">Oleh: ${d.sharedBy || '-'}</div>
  <div style="font-size:10px;color:var(--cyan);margin-top:8px">${fmtDate(d.sharedAt)}</div>
</div>`).join('');
}

function openSharedDocDetail(id, nama, contentPreview) {
  currentShareDocId = id;
  const d = allShared.find(x => x.id === id) || {};
  const titleEl = document.getElementById('modalDocDetailTitle');
  if (titleEl) titleEl.textContent = '📄 ' + (d.docName || nama);
  const contentEl = document.getElementById('modalDocContent');
  if (contentEl) contentEl.innerHTML = d.content || contentPreview || '<em>Tidak ada konten</em>';
  const commEl = document.getElementById('modalComments');
  if (commEl) commEl.innerHTML = renderComments(d.comments || []);
  openModal('modalDocDetail');
}
function renderComments(comments) {
  if (!comments || comments.length === 0) return '<div style="color:var(--muted);font-size:11px;text-align:center;padding:8px">Belum ada komentar</div>';
  return comments.map(c => `<div class="comment-item"><div class="comment-avatar">👤</div><div class="comment-body"><div class="comment-author">${c.author || '-'}</div><div class="comment-text">${c.text || ''}</div></div></div>`).join('');
}
async function submitComment() {
  const input = document.getElementById('commentInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text || !currentShareDocId) return;
  const { doc, getDoc, updateDoc } = window._fb;
  const snap = await getDoc(doc(db, 'shared_docs', currentShareDocId));
  if (!snap.exists()) return;
  const comments = [...(snap.data().comments || []), { author: userData.nama, text, time: new Date().toISOString() }];
  await updateDoc(doc(db, 'shared_docs', currentShareDocId), { comments });
  const idx = allShared.findIndex(x => x.id === currentShareDocId);
  if (idx > -1) allShared[idx].comments = comments;
  const commEl = document.getElementById('modalComments');
  if (commEl) commEl.innerHTML = renderComments(comments);
  input.value = '';
}
function downloadSharedDoc() {
  const d = allShared.find(x => x.id === currentShareDocId);
  if (!d) return;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${d.docName}</title>
<style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;padding:2cm}</style>
</head><body><h2>${d.docName}</h2><p><em>Dibuat oleh: ${d.sharedBy}</em></p><hr/>${d.content}</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = d.docName + '.html'; a.click();
  URL.revokeObjectURL(url);
}

// ── BOSP / Bendahara ───────────────────────
async function loadLaporanKeu() {
  const { collection, getDocs, query, where, orderBy } = window._fb;
  const keuDocs = _kontenCache['keuangan'] || [];
  const evalDocs = _kontenCache['evaluasi'] || [];
  const el1 = document.getElementById('statKeuDoc');
  const el2 = document.getElementById('statEvalDoc');
  if (el1) el1.textContent = keuDocs.length;
  if (el2) el2.textContent = evalDocs.length;
  const listEl = document.getElementById('laporanKeuList');
  if (!listEl) return;
  listEl.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  try {
    const snap = await getDocs(query(collection(db, 'shared_docs'), where('sekolah', '==', userData.sekolah), where('target', '==', 'bendahara'), orderBy('sharedAt', 'desc')));
    if (snap.empty) {
      listEl.innerHTML = '<div class="empty-state"><div class="icon">💰</div><p>Belum ada dokumen keuangan masuk</p></div>';
      return;
    }
    const items = [];
    snap.forEach(d => { items.push({ id: d.id, ...d.data() }); });
    listEl.innerHTML = items.map(d => `
  <div class="approval-card" onclick="openSharedDocDetail('${d.id}','${(d.docName || '').replace(/'/g, "\\'")}','')">
    <div style="font-size:22px">💰</div>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600;color:var(--text)">${d.docName || '-'}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">dari ${d.sharedBy || '-'} · ${fmtDate(d.sharedAt)}</div>
    </div>
    <span class="badge badge-keuangan">${d.kategori || 'Keuangan'}</span>
  </div>`).join('');
  } catch (e) { listEl.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Gagal memuat data keuangan</p></div>'; }
}

async function loadMySubmissions() {
  const { collection, getDocs, query, where, orderBy } = window._fb;
  const listEl = document.getElementById('submissionList');
  if (!listEl) return;
  listEl.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  try {
    const snap = await getDocs(query(collection(db, 'shared_docs'), where('sharedById', '==', userData.id), where('target', 'in', ['kepsek', 'approval']), orderBy('sharedAt', 'desc')));
    if (snap.empty) {
      listEl.innerHTML = '<div class="empty-state"><div class="icon">📬</div><p>Belum ada dokumen dikirim ke Kepsek</p></div>';
      return;
    }
    const sMap = { shared: 'Terkirim', pending: '⏳ Menunggu', approved: '✅ Disetujui', rejected: '❌ Ditolak' };
    listEl.innerHTML = snap.docs.map(d => {
      const data = d.data();
      return `<div class="approval-card">
    <div style="font-size:22px">📄</div>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600;color:var(--text)">${data.docName}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${data.kategori} · ${fmtDate(data.sharedAt)}</div>
    </div>
    <span class="badge badge-${data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : 'pending'}">${sMap[data.status] || data.status}</span>
  </div>`;
    }).join('');
  } catch (e) { listEl.innerHTML = '<div class="empty-state"><p>Gagal memuat dokumen</p></div>'; }
}

// ── Kepsek Monitoring ──────────────────────
async function loadMonitor() {
  const { collection, getDocs, query, where } = window._fb;
  const listEl = document.getElementById('monitorList');
  if (!listEl) return;
  listEl.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  try {
    const guruSnap = await getDocs(query(collection(db, 'users'), where('sekolah', '==', userData.sekolah)));
    const sharedSnap = await getDocs(query(collection(db, 'shared_docs'), where('sekolah', '==', userData.sekolah)));
    const allDocs = [];
    sharedSnap.forEach(d => allDocs.push({ id: d.id, ...d.data() }));
    let html = '';
    guruSnap.forEach(gDoc => {
      const g = gDoc.data();
      const roles = g.roles || [g.role];
      if (roles.includes('admin') || roles.includes('kepsek')) return;
      const docs = allDocs.filter(d => d.sharedById === gDoc.id);
      html += `<div class="approval-card" onclick="loadGuruDocs('${gDoc.id}','${g.nama || ''}')">
    <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${roles.includes('bendahara') ? '💰' : '👨‍🏫'}</div>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600;color:var(--text)">${g.nama || '-'}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${roles.join(' · ')}</div>
    </div>
    <div style="text-align:right">
      <div style="font-family:'Orbitron',sans-serif;font-size:16px;color:var(--cyan)">${docs.length}</div>
      <div style="font-size:10px;color:var(--muted)">Dokumen</div>
    </div>
  </div>`;
    });
    listEl.innerHTML = html || '<div class="empty-state"><div class="icon">👨‍🏫</div><p>Belum ada data</p></div>';
  } catch (e) { listEl.innerHTML = '<div class="empty-state"><p>Gagal memuat monitor</p></div>'; }
}
async function loadGuruDocs(guruId, guruNama) {
  const { collection, getDocs, query, where, orderBy } = window._fb;
  const listEl = document.getElementById('monitorList');
  if (!listEl) return;
  const snap = await getDocs(query(collection(db, 'shared_docs'), where('sharedById', '==', guruId), orderBy('sharedAt', 'desc')));
  let html = `<div class="back-btn" style="margin-bottom:12px;display:inline-flex;cursor:pointer" onclick="loadMonitor()">← Kembali</div><div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:10px">Dokumen dari ${guruNama}</div>`;
  snap.forEach(d => {
    const data = d.data();
    const sMap = { shared: 'Dibagikan', pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };
    html += `<div class="approval-card" onclick="openSharedDocKepsek('${d.id}')">
  <div style="font-size:20px">📄</div>
  <div style="flex:1">
    <div style="font-size:12px;font-weight:600;color:var(--text)">${data.docName}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:2px">${data.kategori} · ${fmtDate(data.sharedAt)}</div>
  </div>
  <span class="badge badge-${data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : 'pending'}">${sMap[data.status] || data.status}</span>
</div>`;
  });
  if (snap.empty) html += '<div class="empty-state"><div class="icon">📄</div><p>Belum ada dokumen</p></div>';
  listEl.innerHTML = html;
}
async function openSharedDocKepsek(docId) {
  const { doc, getDoc } = window._fb;
  const snap = await getDoc(doc(db, 'shared_docs', docId));
  if (!snap.exists()) return;
  const d = { id: docId, ...snap.data() };
  if (!allShared.find(x => x.id === docId)) allShared.push(d);
  currentShareDocId = docId;
  const titleEl = document.getElementById('modalDocDetailTitle');
  if (titleEl) titleEl.textContent = '📄 ' + d.docName;
  const contentEl = document.getElementById('modalDocContent');
  if (contentEl) contentEl.innerHTML = d.content || '<em>Tidak ada konten</em>';
  const commEl = document.getElementById('modalComments');
  if (commEl) commEl.innerHTML = renderComments(d.comments || []);
  openModal('modalDocDetail');
}

async function loadApprovals(statusFilter = 'pending') {
  const { collection, getDocs, query, where, orderBy } = window._fb;
  const listEl = document.getElementById('approvalList');
  if (!listEl) return;
  listEl.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  try {
    const snap = await getDocs(query(collection(db, 'shared_docs'), where('sekolah', '==', userData.sekolah), where('target', '==', 'approval'), where('status', '==', statusFilter), orderBy('sharedAt', 'desc')));
    allApprovals = [];
    snap.forEach(d => allApprovals.push({ id: d.id, ...d.data() }));
    if (statusFilter === 'pending') {
      const badge = document.getElementById('approvalBadge');
      if (badge) { badge.style.display = allApprovals.length > 0 ? '' : 'none'; badge.textContent = allApprovals.length; }
    }
    if (allApprovals.length === 0) {
      listEl.innerHTML = `<div class="empty-state"><div class="icon">✅</div><p>Selesai! Tidak ada dokumen ${statusFilter}</p></div>`;
      return;
    }
    listEl.innerHTML = allApprovals.map(d => `
  <div class="approval-card">
    <div style="font-size:22px">📄</div>
    <div style="flex:1;cursor:pointer" onclick="openSharedDocKepsek('${d.id}')">
      <div style="font-size:13px;font-weight:600;color:var(--text)">${d.docName}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${d.sharedBy} · ${fmtDate(d.sharedAt)}</div>
    </div>
    ${d.status === 'pending' ? `<div style="display:flex;gap:6px"><button class="btn btn-success btn-sm" onclick="approveDoc('${d.id}')">✅ Setujui</button><button class="btn btn-danger btn-sm" onclick="rejectDoc('${d.id}')">❌ Tolak</button></div>` : `<span class="badge badge-${d.status}">${d.status}</span>`}
  </div>`).join('');
  } catch (e) { listEl.innerHTML = '<div class="empty-state"><p>Gagal memuat approvals</p></div>'; }
}
function filterApproval(f) {
  ['pending', 'approved', 'rejected'].forEach(k => { document.getElementById('af' + k.charAt(0).toUpperCase() + k.slice(1))?.classList.toggle('active', k === f); });
  loadApprovals(f);
}
async function approveDoc(id) {
  const { doc, updateDoc, serverTimestamp } = window._fb;
  await updateDoc(doc(db, 'shared_docs', id), { status: 'approved', approvedBy: userData.nama, approvedAt: serverTimestamp() });
  loadApprovals('pending');
}
async function rejectDoc(id) {
  const { doc, updateDoc, serverTimestamp } = window._fb;
  await updateDoc(doc(db, 'shared_docs', id), { status: 'rejected', rejectedBy: userData.nama, rejectedAt: serverTimestamp() });
  loadApprovals('pending');
}

async function loadRekap() {
  const { collection, getDocs, query, where } = window._fb;
  const el = document.getElementById('rekapContent');
  if (!el) return;
  el.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  try {
    const guruSnap = await getDocs(query(collection(db, 'users'), where('sekolah', '==', userData.sekolah)));
    const sharedSnap = await getDocs(query(collection(db, 'shared_docs'), where('sekolah', '==', userData.sekolah)));
    const allDocs = [];
    sharedSnap.forEach(d => allDocs.push({ id: d.id, ...d.data() }));
    let html = '<div class="card"><div class="card-header"><div class="card-title">📊 REKAP PER PENGGUNA</div></div><div class="card-body">';
    guruSnap.forEach(gDoc => {
      const g = gDoc.data();
      const roles = g.roles || [g.role];
      if (roles.includes('admin')) return;
      const docs = allDocs.filter(d => d.sharedById === gDoc.id);
      html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(0,229,255,0.07)">
    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:16px">👤</div>
    <div style="flex:1"><div style="font-size:12px;font-weight:700;color:#fff">${g.nama || '-'}</div><div style="font-size:10px;color:var(--muted)">${roles.join(' · ')}</div></div>
    <div style="text-align:right"><div style="font-family:'Orbitron',sans-serif;font-size:16px;color:var(--cyan)">${docs.length}</div><div style="font-size:10px;color:var(--muted)">Dokumen</div></div></div>`;
    });
    el.innerHTML = html + '</div></div>';
  } catch (e) { el.innerHTML = '<div class="empty-state"><p>Gagal memuat rekap</p></div>'; }
}

// ── Dashboard / Beranda ────────────────────
function loadBeranda() {
  const roles = userData.roles || ['guru'];
  const isBendahara = roles.includes('bendahara');
  const isKepsek = roles.includes('kepsek');
  
  // Re-sync basic info
  setupUser();

  const welcomeAvatar = document.getElementById('welcomeAvatar');
  if (welcomeAvatar) {
    welcomeAvatar.textContent = isKepsek ? '🏛️' : isBendahara ? '💰' : '👨‍🏫';
  }

  // Stats
  const totalDocs = Object.values(_kontenCache).reduce((acc, docs) => acc + docs.length, 0);
  let statsHtml = [
    { icon: '📂', num: _menuDataDynamic.length, label: 'Kategori' },
    { icon: '📄', num: totalDocs, label: 'Total Dokumen' }
  ].map(s => `
    <div class="stat-card">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-num" style="font-family:'Orbitron',sans-serif">${s.num}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  if (isBendahara) {
    statsHtml += `
    <div class="stat-card" style="cursor:pointer;border-color:rgba(255,208,0,0.3)" onclick="navTo(null,'keuangan','KEUANGAN',loadLaporanKeu)">
      <div class="stat-icon">💰</div>
      <div class="stat-num" style="font-family:'Orbitron',sans-serif">${(_kontenCache['keuangan'] || []).length}</div>
      <div class="stat-label">Keuangan</div>
    </div>`;
  }

  const homeStats = document.getElementById('homeStats');
  if (homeStats) homeStats.innerHTML = statsHtml;

  // Quick Menu (Max 6)
  const quick = document.getElementById('quickMenuHome');
  if (quick) {
    if (_menuDataDynamic.length === 0) {
      quick.innerHTML = '<div style="padding:16px;color:var(--muted);font-size:11px">Belum ada kategori tersedia</div>';
    } else {
      quick.innerHTML = _menuDataDynamic.slice(0, 6).map(m => `
      <div class="recent-item" style="cursor:pointer;padding:8px;border-radius:6px;margin-bottom:4px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.02)" onclick="openDocList('${m.id}')">
        <div style="font-size:18px">${m.icon}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600;color:#fff">${m.title}</div>
          <div style="font-size:10px;color:var(--muted)">${m.items.length} Dokumen</div>
        </div>
        <span style="color:var(--cyan);font-size:10px">BUKA</span>
      </div>`).join('');
    }
  }
}

async function loadProfil() {
  const { doc, getDoc } = window._fb;
  try {
    const snap = await getDoc(doc(db, 'users', userData.id));
    if (!snap.exists()) return;
    const data = snap.data();
    const roles = data.roles || [data.role || 'guru'];
    const avEl = document.getElementById('profilAvatar');
    if (avEl) avEl.textContent = roles.includes('bendahara') ? '💰' : roles.includes('kepsek') ? '🏛️' : '👨‍🏫';
    const nameEl = document.getElementById('profilNama');
    if (nameEl) nameEl.textContent = data.nama;
    const badgeEl = document.getElementById('profilRoleBadge');
    if (badgeEl) badgeEl.innerHTML = roles.map(r => `<span class="badge badge-approved" style="margin:2px">${r}</span>`).join('');
    const schEl = document.getElementById('profilSekolah');
    if (schEl) schEl.textContent = data.sekolah;
    const unEl = document.getElementById('profilUsername');
    if (unEl) unEl.textContent = data.username;
    const expEl = document.getElementById('profilExpired');
    if (expEl) {
      const exp = data.expired ? (data.expired.toDate ? data.expired.toDate() : new Date(data.expired)) : null;
      expEl.textContent = exp ? exp.toLocaleDateString('id-ID') : '-';
    }
    const stEl = document.getElementById('profilStatus');
    if (stEl) stEl.innerHTML = `<span class="badge badge-${data.status === 'aktif' ? 'approved' : 'rejected'}">${data.status}</span>`;
  } catch (e) { }
}
async function gantiPasswordUser() {
  const { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } = window._fb;
  const old = document.getElementById('oldPassUser')?.value;
  const nw = document.getElementById('newPassUser')?.value;
  const conf = document.getElementById('confirmPassUser')?.value;
  if (!old || !nw || !conf) { showToast('warn', 'Field kosong', 'Semua field wajib diisi'); return; }
  if (nw !== conf) { showToast('warn', 'Mismatch', 'Password baru tidak cocok'); return; }
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('username', '==', userData.username)));
    const userDoc = snap.docs[0];
    if (userDoc.data().password !== old) { showToast('error', 'Gagal', 'Password lama salah'); return; }
    await updateDoc(doc(db, 'users', userDoc.id), { password: nw, updatedAt: serverTimestamp() });
    showToast('success', 'Berhasil', 'Password diperbarui');
  } catch (e) { }
}

function toggleNotif() { document.getElementById('notifPanel')?.classList.toggle('show'); }
async function loadNotifications() {
  const { collection, getDocs, query, orderBy } = window._fb;
  try {
    const snap = await getDocs(query(collection(db, 'notifications'), orderBy('sentAt', 'desc')));
    const items = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.target === 'all' || userData.roles.includes(data.target)) items.push(data);
    });
    if (items.length > 0) {
      document.getElementById('notifDot')?.classList.add('show');
      const listEl = document.getElementById('notifList');
      if (listEl) listEl.innerHTML = items.slice(0, 8).map(n => `<div class="notif-item"><div style="font-size:12px;font-weight:600;color:var(--text)">${n.title}</div><div style="font-size:11px;color:var(--muted)">${n.message}</div></div>`).join('');
    }
  } catch (e) { }
}

async function checkUpdate() {
  const { doc, getDoc } = window._fb;
  try {
    const appConfig = await window.cimegaAPI.getAppConfig();
    const snap = await getDoc(doc(db, 'appConfig', 'version'));
    if (!snap.exists()) return;
    const data = snap.data();
    if (data.current !== appConfig.appVersion) {
      document.getElementById('updateBanner')?.classList.add('show');
      document.getElementById('updateTitle').textContent = `🚀 Update v${data.current} Tersedia!`;
      window._updateUrl = data.downloadUrl;
    }
  } catch (e) { }
}
function doUpdate() { if (window._updateUrl) window.cimegaAPI.openExternal(window._updateUrl); }
function fmtDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
function doLogout() { if (confirm('Keluar dari aplikasi?')) { localStorage.removeItem('cimega_user'); window.location.href = '../login/login.html'; } }

// ── AI ASISTEN Logic ───────────────────────
let _chatHistory = [];
function switchAiTab(tab, el) {
  document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.ai-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('aiPanel-' + tab);
  if (panel) panel.style.display = '';
}
async function generateDocAI() {
  const prompt = document.getElementById('docAiPrompt')?.value.trim();
  if (!prompt) return;
  const btn = document.getElementById('btnRunDocAi');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating...'; }
  try {
    const res = await window.CimegaAI.ask({
      messages: [{ role: 'user', content: `Buatkan isi "${currentDocName}". Instruksi: ${prompt}. Role: ${userData.roles.join(', ')}. Output: HANYA HTML murni.` }],
      maxTokens: 3000
    });
    const ce = document.getElementById('docContent');
    if (ce && res.text) {
      if (!ce.innerHTML.trim() || ce.innerHTML.includes('Template belum diisi')) ce.innerHTML = res.text;
      else ce.innerHTML += '<br><br>' + res.text;
      closeModal('modalDocAi');
      if (ce.contentEditable !== 'true') toggleEdit();
    }
  } finally { if (btn) { btn.disabled = false; btn.textContent = '🚀 Generate Sekarang'; } }
}
function appendChat(role, text) {
  const el = document.getElementById('chatMessages');
  if (!el) return;
  const div = document.createElement('div'); div.className = 'chat-msg chat-' + role;
  let contentHtml = text;
  if (role === 'ai' && window.marked && !text.includes('ai-loading-dot')) contentHtml = marked.parse(text);
  else if (role === 'user') contentHtml = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
  div.innerHTML = `<div class="chat-bubble"><div>${contentHtml}</div></div>`;
  el.appendChild(div); el.scrollTop = el.scrollHeight;
}
async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input?.value.trim(); if (!text) return;
  input.value = ''; appendChat('user', text);
  _chatHistory.push({ role: 'user', content: text });
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg chat-ai chat-typing';
  typingDiv.innerHTML = `<div class="chat-bubble"><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div></div>`;
  document.getElementById('chatMessages')?.appendChild(typingDiv);
  try {
    const res = await window.CimegaAI.ask({
      system: `Anda adalah "AI SUPER ASISTEN" khusus SDN Cimega. Pakar Kurikulum Merdeka & Administrasi.`,
      messages: _chatHistory.slice(-10),
      maxTokens: 2000,
    });
    typingDiv.remove();
    const reply = res.error ? '❌ ' + res.error : res.text;
    appendChat('ai', reply);
    _chatHistory.push({ role: 'assistant', content: reply });
  } catch (e) { typingDiv.remove(); }
}

async function initApp() {
  try {
    const firebaseConfig = window.cimegaConfig?.firebase || await window.cimegaAPI?.getFirebaseConfig();
    if (!firebaseConfig?.apiKey) {
      console.error('Settings: Firebase config null');
      showToast('error', 'Koneksi Gagal', 'Konfigurasi pusat data tidak ditemukan.');
      return;
    }

    const { initializeApp, getApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const fbFs = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const {
      getFirestore, collection, doc, getDoc, getDocs, addDoc,
      updateDoc, deleteDoc, onSnapshot, query, where, orderBy,
      serverTimestamp, Timestamp
    } = fbFs;

    // ── Safe init Firebase app ────────────────────────────────
    let fbApp;
    try { fbApp = getApp(); } catch (_) { fbApp = initializeApp(firebaseConfig); }
    db = getFirestore(fbApp);

    // ── CRITICAL: expose db + helpers ke window._fb ──────────
    // Semua fungsi Firestore harus ada di sini agar loadKontenDynamic() tidak crash
    window._fb = {
      db,
      collection, doc, getDoc, getDocs, addDoc,
      updateDoc, deleteDoc, onSnapshot, query, where, orderBy,
      serverTimestamp, Timestamp
    };

    console.log('✅ Settings: Firebase ready →', firebaseConfig.projectId);

    // ── Setup user dan render sidebar awal SEGERA setelah Firebase siap ──
    // Ini memastikan sidebar tidak kosong bahkan sebelum data Firestore tiba
    setupUser();
    buildSidebar();
    loadBeranda();

    // ── Mulai listener real-time (akan panggil refreshDashboardUI saat data tiba) ──
    loadKontenDynamic();

    loadNotifications();
    checkUpdate();
    try {
      await CimegaUpdater.init({ owner: 'prabu26dev', repo: 'Cimega_Smart_Office' });
      CimegaUpdater.startChecking(db);
    } catch (e) { }
    if (userData.roles.includes('kepsek')) {
      const snap = await getDocs(query(collection(db, 'shared_docs'), where('sekolah', '==', userData.sekolah), where('target', '==', 'approval'), where('status', '==', 'pending')));
      if (!snap.empty) { const b = document.getElementById('approvalBadge'); if (b) { b.style.display = ''; b.textContent = snap.size; } }
    }
    if (userData.roles.includes('bendahara')) {
      const snap = await getDocs(query(collection(db, 'shared_docs'), where('sekolah', '==', userData.sekolah), where('target', '==', 'bendahara'), where('status', '==', 'pending')));
      if (!snap.empty) { const b = document.getElementById('submBadge'); if (b) { b.style.display = ''; b.textContent = snap.size; } }
    }
  } catch (e) { console.error('initApp error', e); }
}

CimegaMusic.init();
initApp();

// EXPOSE TO GLOBAL (Essential for inline event listeners in dashboard.html)
window.navTo = navTo;
window.navToMenu = navToMenu;
window.goBack = goBack;
window.goBackToList = goBackToList;
window.toggleEdit = toggleEdit;
window.saveDoc = saveDoc;
window.fmt = fmt;
window.downloadDoc = downloadDoc;
window.printDoc = printDoc;
window.setPageSize = setPageSize;
window.setMargin = setMargin;
window.setOrientation = setOrientation;
window.openShareModal = openShareModal;
window.doShare = doShare;
window.loadShared = loadShared;
window.filterShared = filterShared;
window.openSharedDocDetail = openSharedDocDetail;
window.submitComment = submitComment;
window.downloadSharedDoc = downloadSharedDoc;
window.loadLaporanKeu = loadLaporanKeu;
window.loadMySubmissions = loadMySubmissions;
window.loadMonitor = loadMonitor;
window.loadGuruDocs = loadGuruDocs;
window.openSharedDocKepsek = openSharedDocKepsek;
window.loadApprovals = loadApprovals;
window.filterApproval = filterApproval;
window.approveDoc = approveDoc;
window.rejectDoc = rejectDoc;
window.loadRekap = loadRekap;
window.loadBeranda = loadBeranda;
window.loadProfil = loadProfil;
window.gantiPasswordUser = gantiPasswordUser;
window.toggleNotif = toggleNotif;
window.doUpdate = doUpdate;
window.doLogout = doLogout;
window.switchAiTab = switchAiTab;
window.sendChat = sendChat;
window.sendSchoolChat = () => window.CimegaChat?.send?.();
window.generateDocAI = generateDocAI;
window.openDocAiModal = () => openModal('modalDocAi');
window.openDoc = openDoc;
window.openDocList = openDocList;
window.filterShared = (f) => {
  // Bisa dipanggil dengan string filter ('all','school','mine') atau dari event
  const filter = typeof f === 'string' ? f : 'all';
  ['all', 'school', 'mine'].forEach(k => {
    document.getElementById('sf' + k.charAt(0).toUpperCase() + k.slice(1))?.classList.toggle('active', k === filter);
  });
  renderShared(filter);
};
function copyAiResult(elId) { const el = document.getElementById(elId); if (el) navigator.clipboard.writeText(el.textContent || '').then(() => showToast('success', 'Tersalin', 'Teks berhasil disalin')); }
function saveAiResult(elId, tipe) { showToast('info', 'Petunjuk', 'Salin teks lalu tempel di editor Anda'); }
window.copyAiResult = copyAiResult;
window.saveAiResult = saveAiResult;
