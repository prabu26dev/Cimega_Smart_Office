const { collection, getDocs, doc, setDoc, query, where, onSnapshot, serverTimestamp } = window._fb;
const db = window.db;

let userData = null;
let currentItem = null;
let _kontenCache = {};

window.addEventListener('DOMContentLoaded', async () => {
  const local = localStorage.getItem('cimega_user');
  if(!local){
    window.location.href = '../login/login.html';
    return;
  }
  userData = JSON.parse(local);
  
  if(!userData.roles.includes('ops') && !userData.roles.includes('kepsek')){
    alert('Akses Ditolak: Anda tidak memiliki otoritas Operator Sekolah (OPS).');
    window.location.href = '../dashboard/dashboard.html';
    return;
  }

  // Set Profile info in UI
  document.getElementById('opsNama').textContent = userData.nama;
  document.getElementById('opsSekolah').textContent = userData.sekolah || 'Tidak ada instansi';

  // Listen Datasets from firestore
  listenKonten();

  // Render Sidebar
  renderSidebar();

  // Show home wrapper
  showPage('home');
});

function listenKonten() {
  const q = query(collection(db, 'konten'), where('sekolah', '==', userData.sekolah));
  onSnapshot(q, (snap) => {
    _kontenCache = {};
    snap.forEach(docSnap => {
      const d = docSnap.data();
      // Filter kepemilikan khusus miliknya
      if(d.owner !== userData.id) return;
      
      const kat = d.kategori || 'umum';
      if(!_kontenCache[kat]) _kontenCache[kat] = [];
      _kontenCache[kat].push({ id: docSnap.id, ...d });
    });
    if (currentItem) {
      renderDocList(currentItem);
    }
  });
}

function renderSidebar() {
  const sidebar = document.getElementById('opsMenu');
  if(!sidebar) return;
  sidebar.innerHTML = '';
  
  Object.keys(window.OpsModules || {}).forEach(k => {
    const mod = window.OpsModules[k];
    const el = document.createElement('div');
    el.className = 'menu-sub';
    el.innerHTML = `<div class="menu-sub-title"><span>${mod.icon}</span> ${mod.title}</div>`;
    mod.items.forEach(it => {
      const btn = document.createElement('div');
      btn.className = 'menu-item';
      btn.innerHTML = `<div class="icon">${it.icon}</div><div>${it.nama}</div>`;
      btn.onclick = () => openCategory(k, it);
      el.appendChild(btn);
    });
    sidebar.appendChild(el);
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
}

function openCategory(modId, item) {
  currentItem = { mod: window.OpsModules[modId], item };
  document.getElementById('doclistTitle').innerHTML = `${item.icon} ${item.nama}`;
  renderDocList(currentItem);
  showPage('doclist');
}

function renderDocList({ mod, item }) {
  const grid = document.getElementById('doclistGrid');
  const catKey = 'ops_' + item.id;
  const docs = _kontenCache[catKey] || [];
  
  // Custom glowing button warna biru (#00a8ff)
  let html = `
    <div class="card" style="cursor:pointer;border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:160px;transition:all 0.3s" onclick="openNewDoc()">
      <div style="font-size:32px;margin-bottom:10px">➕</div>
      <div style="font-weight:600;color:var(--blue)">Sinkron Data Baru</div>
    </div>
  `;
  
  docs.forEach(d => {
    html += `
      <div class="card doc-item" style="cursor:pointer" onclick="openDoc('${d.id}')">
        <div class="card-body">
          <div style="font-size:24px;margin-bottom:10px">${item.icon}</div>
          <div style="font-weight:600;margin-bottom:8px">${d.nama}</div>
          <div style="font-size:12px;color:var(--muted)">📅 ${d.updatedAt? new Date(d.updatedAt.toMillis()).toLocaleDateString() : 'Baru'}</div>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

let activeDocId = null;

function openNewDoc() {
  activeDocId = null;
  document.getElementById('editorTitle').value = '';
  document.getElementById('editorTitle').placeholder = 'Arsip ' + currentItem.item.nama;
  renderForm(currentItem.item);
  showPage('editor');
}

function openDoc(docId) {
  const catKey = 'ops_' + currentItem.item.id;
  activeDocId = docId;
  const d = _kontenCache[catKey].find(x => x.id === docId);
  if(d) {
    document.getElementById('editorTitle').value = d.nama;
    renderForm(currentItem.item, d.componentsData || {});
    showPage('editor');
  }
}

function renderForm(item, savedData = {}) {
  const form = document.getElementById('editorForm');
  form.innerHTML = '';
  
  item.components.forEach(c => {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `<label class="form-label">${c.label}</label>
                     <textarea class="form-control" id="form_${c.id}" placeholder="Ketik draf acuan (mentahan) dari ${c.label}...">${savedData[c.id] || ''}</textarea>`;
    form.appendChild(div);
  });
}

function getFormData() {
  const data = {};
  currentItem.item.components.forEach(c => {
    data[c.id] = document.getElementById('form_' + c.id).value;
  });
  return data;
}

async function saveDoc() {
  const title = document.getElementById('editorTitle').value.trim();
  if(!title) { alert('Kolom Judul Arsip Data tidak boleh kosong!'); return; }
  
  const data = getFormData();
  const catKey = 'ops_' + currentItem.item.id;
  const docId = activeDocId || 'ops_' + Date.now();
  
  const payload = {
    nama: title,
    kategori: catKey,
    sekolah: userData.sekolah,
    owner: userData.id,
    componentsData: data,
    updatedAt: serverTimestamp()
  };
  
  try {
    await setDoc(doc(db, 'konten', docId), payload, {merge:true});
    activeDocId = docId;
    alert('Log Sinkronisasi Database (Dapodik/ANBK) sukses direkam!');
  } catch(e) {
    console.error(e);
    alert('Jaringan Firebase memutus permintaan!');
  }
}

async function generateAI() {
  const { ai_prompt } = currentItem.item;
  const data = getFormData();
  
  let promptText = ai_prompt;
  Object.keys(data).forEach(k => {
    promptText = promptText.replace(new RegExp(`{{${k}}}`, 'g'), data[k] || '(Data kosong/Invalid)');
  });
  
  if (typeof window.sendPromptToAI === 'function') {
      window.sendPromptToAI(promptText);
  } else {
      alert("AI Prompt (Salin instruksi Helpdesk Pusat ini ke Chat AI):\n\n" + promptText);
  }
}

function logout() {
  localStorage.removeItem('cimega_user');
  window.location.href = '../login/login.html';
}
