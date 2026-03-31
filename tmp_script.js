
'use strict';
// ══════════════════════════════════════════
// DASHBOARD — CIMEGA SMART OFFICE
// Versi: Role Bendahara Integrated
// ══════════════════════════════════════════

let db, userData;
let pageHistory=[], currentKat='', currentDocId='', currentDocName='';
let allShared=[], allApprovals=[], currentShareDocId='';
let pageSettings={size:'A4',margin:'Normal',orientation:'Portrait'};
let _kontenCache={}, _menuDataDynamic=[];

userData=JSON.parse(localStorage.getItem('cimega_user')||'{}');
if(!userData?.role||userData.role==='admin') window.location.href='../login/login.html';
if(!userData.roles) userData.roles=userData.role?[userData.role]:['guru'];

// ── Kategori meta ──────────────────────────
const katMeta={
  adm_guru:   {icon:'📚',title:'Administrasi Guru & Pembelajaran',       desc:'RPP, Modul Ajar, Penilaian, Jurnal'},
  adm_kepsek: {icon:'🏛️',title:'Administrasi Kepala Sekolah',            desc:'Tugas Pokok, Supervisi, Manajerial, Humas'},
  kosp:       {icon:'📋',title:'Kurikulum Operasional Satuan Pendidikan', desc:'Karakteristik, Visi Misi, Perencanaan'},
  adm_umum:   {icon:'🏫',title:'Administrasi Umum Sekolah',               desc:'SK, Inventaris, Jadwal, Tata Tertib'},
  keuangan:   {icon:'💰',title:'Keuangan & BOS',                          desc:'Laporan BOS, RKAS, BKU, LPJ, Nota'},
  evaluasi:   {icon:'📊',title:'Evaluasi & Pelaporan Sekolah',            desc:'EDS, Akreditasi, Supervisi, Monev'},
  perpus:     {icon:'📖',title:'Administrasi Perpustakaan Lengkap',       desc:'Keanggotaan, Peminjaman, Keuangan'},
};

// Kategori per role — urutan standar global
// visibleTo di setiap dokumen menentukan siapa yang bisa melihat isinya
const katByRole={
  guru:      ['adm_guru','adm_umum','evaluasi','perpus'],
  kepsek:    ['adm_guru','adm_kepsek','kosp','adm_umum','keuangan','evaluasi','perpus'],
  bendahara: ['keuangan','evaluasi'],
  ops:       ['adm_umum','keuangan','evaluasi','perpus'],
};

// Urutan tampil global (dari yang paling sering dipakai guru)
const KAT_ORDER = ['adm_guru','adm_kepsek','kosp','adm_umum','keuangan','evaluasi','perpus'];

// Gabungkan semua kategori dari semua role yang dimiliki user
// Ini penting untuk guru merangkap bendahara / ops
function getOrderedKats(roles){
  const merged = new Set();
  roles.forEach(r => { (katByRole[r]||[]).forEach(k => merged.add(k)); });
  return KAT_ORDER.filter(k => merged.has(k));
}

// ── Load konten dari Firestore ─────────────
async function loadKontenDynamic(){
  const{collection,getDocs}=window._fb;
  const roles=userData.roles;
  try{
    const snap=await getDocs(collection(db,'konten'));
    const byKat={};
    snap.forEach(d=>{
      const data=d.data();
      const visible=data.visibleTo||['guru','kepsek','bendahara','ops'];
      const canSee=roles.some(r=>visible.includes(r));
      if(!canSee) return;
      if(!byKat[data.kategori]) byKat[data.kategori]=[];
      byKat[data.kategori].push({id:d.id,nama:data.nama,...data});
    });
    _kontenCache=byKat;
    const orderedKats=getOrderedKats(roles);
    _menuDataDynamic=[];
    orderedKats.forEach(katId=>{
      const docs=byKat[katId]||[];
      if(docs.length===0) return;
      const meta=katMeta[katId]||{icon:'📄',title:katId,desc:''};
      _menuDataDynamic.push({id:katId,icon:meta.icon,title:meta.title,desc:meta.desc,items:docs.map(d=>d.nama),docs});
    });
  }catch(e){console.error('loadKontenDynamic error',e);}
}

// ── Clock ──────────────────────────────────
setInterval(()=>{
  document.getElementById('topbarTime').textContent=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
},1000);

// ── Toast ──────────────────────────────────
function showToast(type,title,msg){
  const icons={success:'✅',error:'❌',warn:'⚠️',info:'ℹ️'};
  const t=document.createElement('div');t.className=`toast ${type}`;
  t.innerHTML=`<span style="font-size:16px">${icons[type]||'ℹ️'}</span><div><strong style="display:block;margin-bottom:1px">${title}</strong>${msg||''}</div>`;
  document.getElementById('toastWrap').appendChild(t);setTimeout(()=>t.remove(),4000);
}
function closeModal(id){document.getElementById(id).classList.remove('show');}
function openModal(id){document.getElementById(id).classList.add('show');}

// ── Navigation ─────────────────────────────
function showPage(id,title){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.getElementById('topbarTitle').textContent=title||id.toUpperCase();
}
function goBack(){
  if(pageHistory.length>0){const p=pageHistory.pop();showPage(p.id,p.title);}
  else showPage('beranda','BERANDA');
}
function goBackToList(){showPage('doclist','DAFTAR DOKUMEN');}

// ── Sidebar ────────────────────────────────
function buildSidebar(){
  const roles=userData.roles;
  let html=`<div class="nav-section">Menu Utama</div>
  <div class="nav-item active" onclick="navTo(this,'beranda','BERANDA',loadBeranda)"><span class="nav-icon">🏠</span>Beranda</div>
  <div class="nav-section">Dokumen</div>`;
  _menuDataDynamic.forEach(m=>{
    html+=`<div class="nav-item" onclick="navToMenu(this,'${m.id}')"><span class="nav-icon">${m.icon}</span><span style="flex:1;font-size:11px;line-height:1.3">${m.title}</span></div>`;
  });
  html+=`<div class="nav-section">Kolaborasi</div>
  <div class="nav-item" onclick="navTo(this,'shared','DOKUMEN BERSAMA',loadShared)"><span class="nav-icon">📤</span>Dok. Bersama</div>`;

  // ★ BARU: menu khusus bendahara
  if(roles.includes('bendahara')){
    html+=`<div class="nav-item" onclick="navTo(this,'keuangan','LAPORAN KEUANGAN',loadLaporanKeu)"><span class="nav-icon">💰</span>Laporan Keuangan</div>`;
  }
  if(roles.includes('guru')){
    html+=`<div class="nav-item" onclick="navTo(this,'approval-guru','DIKIRIM KE KEPSEK',loadMySubmissions)"><span class="nav-icon">📬</span>Dikirim ke Kepsek<span class="nav-badge" id="submBadge" style="display:none">!</span></div>`;
  }
  if(roles.includes('kepsek')){
    html+=`<div class="nav-item" onclick="navTo(this,'monitor','MONITOR GURU',loadMonitor)"><span class="nav-icon">👁️</span>Monitor Guru</div>
    <div class="nav-item" onclick="navTo(this,'validasi','VALIDASI DOKUMEN',()=>loadApprovals('pending'))"><span class="nav-icon">✅</span>Validasi Dok.<span class="nav-badge" id="approvalBadge" style="display:none">!</span></div>
    <div class="nav-item" onclick="navTo(this,'rekap','REKAP DOKUMEN',loadRekap)"><span class="nav-icon">📊</span>Rekap Dokumen</div>`;
  }
  html+=`<div class="nav-section">Fitur AI</div>
  <div class="nav-item" onclick="navTo(this,'ai','AI ASISTEN',null)"><span class="nav-icon">✨</span>AI Asisten</div>
  <div class="nav-section">Lainnya</div>
  <div class="nav-item" onclick="navTo(this,'profil','PROFIL SAYA',loadProfil)"><span class="nav-icon">👤</span>Profil Saya</div>`;
  document.getElementById('sidebarNav').innerHTML=html;
}
function navTo(el,pageId,title,fn){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(el) el.classList.add('active');
  pageHistory=[];
  showPage(pageId,title);
  if(fn) fn();
}
function navToMenu(el,menuId){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(el) el.classList.add('active');
  pageHistory=[];
  renderMenuGrid(_menuDataDynamic,menuId);
  showPage('menu','ADMINISTRASI');
}

// ── setupUser ──────────────────────────────
function setupUser(){
  document.getElementById('sidebarNama').textContent=userData.nama||'-';
  const roles=userData.roles;
  // ★ BARU: roleMap dengan bendahara
  const roleMap={
    guru:      {cls:'role-guru',      label:'👨‍🏫 Guru'},
    kepsek:    {cls:'role-kepsek',    label:'🏛️ Kepsek'},
    bendahara: {cls:'role-bendahara', label:'💰 Bendahara'},
    ops:       {cls:'role-ops',       label:'💻 Operator'},
  };
  const rb=document.getElementById('sidebarRole');
  if(roles.length===1){
    const r=roleMap[roles[0]]||{cls:'role-guru',label:roles[0]};
    rb.className='user-role-badge '+r.cls;
    rb.textContent=r.label;
  } else {
    rb.className='user-role-badge role-guru';
    rb.textContent=roles.map(r=>roleMap[r]?.label||r).join(' · ');
  }
  document.getElementById('sidebarSekolah').textContent=userData.sekolah||'-';
  document.getElementById('schoolName').textContent=userData.sekolah||'SDN Cimega';
}

// ── Menu Grid ──────────────────────────────
// FIX: onclick hanya meneruskan m.id (string aman), BUKAN JSON.stringify(m.items)
// yang mengandung tanda " dan merusak atribut onclick HTML.
function renderMenuGrid(menus){
  const roles=userData.roles;
  const isBendahara=roles.includes('bendahara');
  document.getElementById('menuGrid').innerHTML=menus.map(m=>`
    <div class="menu-card${isBendahara&&m.id==='keuangan'?' keuangan-highlight':''}"
      onclick="openDocList('${m.id}')">
      <div class="menu-card-count">${m.items.length}</div>
      <div class="menu-card-icon">${m.icon}</div>
      <div class="menu-card-title">${m.title}</div>
      <div class="menu-card-desc">${m.desc}</div>
    </div>`).join('');
}

// ── Doc list ───────────────────────────────
// FIX: Tidak lagi menerima items via parameter (menghindari JSON.stringify
// yang merusak atribut onclick HTML). Data dicari langsung dari _menuDataDynamic.
function openDocList(katId){
  const menu=_menuDataDynamic.find(m=>m.id===katId);
  if(!menu){ console.warn('openDocList: kategori tidak ditemukan →',katId); return; }
  const katTitle=menu.title;
  const items=menu.items;
  currentKat=katId;
  pageHistory.push({id:'menu',title:'ADMINISTRASI'});
  const icons=['📄','📝','📋','🗒️','📃','📑','🗃️'];
  document.getElementById('doclistTitle').innerHTML=`<span>${katTitle.split(' ').slice(0,3).join(' ')}</span>`;
  document.getElementById('doclistSub').textContent=katTitle+' · '+items.length+' dokumen';
  document.getElementById('docGrid').innerHTML=items.map((name,i)=>`
    <div class="doc-item" onclick="openDoc('${katId}','${name.replace(/'/g,"\\'")}')">
      <div class="doc-item-icon">${icons[i%icons.length]}</div>
      <div style="flex:1;min-width:0">
        <div class="doc-item-name">${name}</div>
        <div class="doc-item-meta">${katTitle}</div>
      </div>
      <span style="color:var(--muted);font-size:11px">▶</span>
    </div>`).join('');
  showPage('doclist','DAFTAR DOKUMEN');
}

// ── Buka dokumen ───────────────────────────
async function openDoc(katId,docName){
  currentKat=katId; currentDocName=docName; currentDocId='';
  pageHistory.push({id:'doclist',title:'DAFTAR DOKUMEN'});
  document.getElementById('docviewTitle').textContent=docName;
  document.getElementById('docviewMeta').textContent=katId+' · '+pageSettings.size+' '+pageSettings.orientation;
  document.getElementById('pageInfoLabel').textContent=pageSettings.size+' | '+pageSettings.margin+' | '+pageSettings.orientation;
  const contentEl=document.getElementById('docContent');
  contentEl.contentEditable='false';
  document.getElementById('saveBtn').style.display='none';
  document.getElementById('editBtn').textContent='✏️ Edit';
  contentEl.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted)"><div class="spinner"></div></div>';
  showPage('docview',docName);
  try{
    const{collection,query,where,getDocs}=window._fb;
    const snap=await getDocs(query(collection(db,'konten'),where('kategori','==',katId),where('nama','==',docName)));
    if(!snap.empty){
      const d=snap.docs[0]; currentDocId=d.id;
      const data=d.data();
      const savedContent=data.savedContentByUser?.[userData.id]||data.savedContent||null;
      contentEl.innerHTML=savedContent||data.template?.replace(/\n/g,'<br/>')||
        `<div style="color:var(--muted);text-align:center;padding:36px"><div style="font-size:36px;margin-bottom:12px">📄</div><div style="font-size:13px;color:var(--text);margin-bottom:6px">${docName}</div><div>Template belum diisi admin. Klik <strong>Edit</strong> untuk mulai menulis.</div></div>`;
    } else {
      contentEl.innerHTML=`<div style="color:var(--muted);text-align:center;padding:36px"><div style="font-size:36px;margin-bottom:12px">📄</div><div>Konten belum tersedia dari admin.</div></div>`;
    }
  }catch(e){contentEl.innerHTML='<div style="color:var(--muted);text-align:center;padding:30px">Gagal memuat.</div>';}
}

// ── Edit & Save ────────────────────────────
function toggleEdit(){
  const ce=document.getElementById('docContent');
  const editing=ce.contentEditable==='true';
  if(editing){ce.contentEditable='false';document.getElementById('saveBtn').style.display='none';document.getElementById('editBtn').textContent='✏️ Edit';}
  else{ce.contentEditable='true';ce.focus();document.getElementById('saveBtn').style.display='inline-flex';document.getElementById('editBtn').textContent='✕ Batal';}
}
async function saveDoc(){
  if(!currentDocId){showToast('warn','Perhatian','Dokumen belum ada di database. Hubungi admin.');return;}
  const{doc,updateDoc,serverTimestamp}=window._fb;
  const content=document.getElementById('docContent').innerHTML;
  try{
    const field=`savedContentByUser.${userData.id}`;
    await updateDoc(doc(db,'konten',currentDocId),{[field]:content,updatedAt:serverTimestamp()});
    toggleEdit();
    showToast('success','Tersimpan','Dokumen berhasil disimpan');
  }catch(e){showToast('error','Gagal',e.message);}
}
function fmt(cmd){document.execCommand(cmd,false,null);}

// ── Download ───────────────────────────────
function downloadDoc(){
  const content=document.getElementById('docContent').innerHTML;
  const title=currentDocName||'Dokumen';
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
    <style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;color:#000;padding:2cm;max-width:21cm;margin:0 auto}</style>
    </head><body><h2 style="font-family:Arial">${title}</h2><hr/>${content}</body></html>`;
  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=title+'.html'; a.click();
  URL.revokeObjectURL(url);
  showToast('success','Diunduh',title+' berhasil diunduh');
}

// ── Print ──────────────────────────────────
function printDoc(){
  const content=document.getElementById('docContent').innerHTML;
  const title=currentDocName||'Dokumen';
  const w=window.open('','_blank');
  const margins={Normal:'2.54cm',Moderate:'1.91cm',Narrow:'1.27cm'};
  const mg=margins[pageSettings.margin]||'2.54cm';
  const sz=pageSettings.size==='F4'?'21.59cm 33.02cm':'A4';
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>@page{size:${sz};margin:${mg}}body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;color:#000}</style>
    </head><body>${content}</body></html>`);
  w.document.close(); setTimeout(()=>{w.print();w.close();},400);
}

// ── Page settings ──────────────────────────
function setPageSize(s){
  pageSettings.size=s;
  ['A4','F4'].forEach(k=>document.getElementById('ps'+k)?.classList.toggle('active',k===s));
}
function setMargin(m){
  pageSettings.margin=m;
  ['Normal','Moderate','Narrow'].forEach(k=>document.getElementById('ps'+k)?.classList.toggle('active',k===m));
}
function setOrientation(o){
  pageSettings.orientation=o;
  ['Portrait','Landscape'].forEach(k=>document.getElementById('ps'+k)?.classList.toggle('active',k===o));
}

// ══════════════════════════════════════════
// SHARE DOKUMEN
// ══════════════════════════════════════════
function openShareModal(){
  if(!currentDocName){showToast('warn','Perhatian','Buka dokumen terlebih dahulu');return;}
  document.getElementById('shareDocName').value=currentDocName;
  openModal('modalShare');
}
async function doShare(){
  const{collection,addDoc,serverTimestamp}=window._fb;
  const target=document.getElementById('shareTarget').value;
  const note=document.getElementById('shareNote').value.trim();
  const content=document.getElementById('docContent').innerHTML;
  if(!currentDocName) return;
  try{
    const isApproval=target==='approval';
    await addDoc(collection(db,'shared_docs'),{
      docName:currentDocName,kategori:currentKat,content,note,
      sharedBy:userData.nama,sharedById:userData.id,
      sekolah:userData.sekolah,target,
      status:isApproval?'pending':'shared',
      sharedAt:serverTimestamp(),comments:[],
    });
    closeModal('modalShare');
    document.getElementById('shareNote').value='';
    const msg=target==='bendahara'?`Dokumen dikirim ke Bendahara`:
              target==='approval'?`Dikirim ke Kepsek untuk persetujuan`:
              target==='kepsek'?`Dibagikan ke Kepala Sekolah`:
              `Dibagikan ke semua guru`;
    showToast('success','Terkirim!',msg);
  }catch(e){showToast('error','Gagal',e.message);}
}

// ── Load shared docs ───────────────────────
async function loadShared(filter='all'){
  const{collection,getDocs,query,where,orderBy}=window._fb;
  const listEl=document.getElementById('sharedList');
  listEl.innerHTML='<div class="empty-state"><div class="spinner"></div></div>';
  try{
    const snap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah),orderBy('sharedAt','desc')));
    allShared=[];
    snap.forEach(d=>allShared.push({id:d.id,...d.data()}));
    renderShared(filter);
  }catch(e){listEl.innerHTML='<div class="empty-state"><p>Gagal memuat</p></div>';}
}
function filterShared(f){
  ['all','school','mine'].forEach(k=>{
    const el=document.getElementById('sf'+k.charAt(0).toUpperCase()+k.slice(1));
    if(el) el.classList.toggle('active',k===f);
  });
  renderShared(f);
}
function renderShared(filter){
  const listEl=document.getElementById('sharedList');
  const roles=userData.roles;
  let items=allShared;
  if(filter==='school') items=allShared.filter(d=>d.sharedById!==userData.id&&d.target==='school');
  if(filter==='mine')   items=allShared.filter(d=>d.sharedById===userData.id);
  // ★ Bendahara melihat dokumen yang ditarget ke dirinya + milik sendiri
  if(roles.includes('bendahara')&&!roles.includes('kepsek')){
    items=items.filter(d=>d.target==='bendahara'||d.target==='school'||d.sharedById===userData.id);
  } else if(!roles.includes('kepsek')){
    items=items.filter(d=>d.target==='school'||d.sharedById===userData.id);
  }
  if(items.length===0){listEl.innerHTML='<div class="empty-state"><div class="icon">📤</div><p>Tidak ada dokumen</p></div>';return;}
  listEl.innerHTML=items.map(d=>`
    <div class="shared-item">
      <div class="shared-header">
        <div class="shared-avatar">👤</div>
        <div style="flex:1">
          <div class="shared-name">${d.sharedBy||'-'}</div>
          <div class="shared-meta">${d.sekolah||'-'} · ${fmtDate(d.sharedAt)}</div>
        </div>
        <span class="badge badge-${d.status==='shared'?'shared':d.status==='pending'?'pending':d.status==='approved'?'approved':'rejected'}">${d.status==='shared'?'Dibagikan':d.status==='pending'?'Menunggu':d.status==='approved'?'Disetujui':'Ditolak'}</span>
      </div>
      <div class="shared-doc" onclick="openSharedDocDetail('${d.id}','${(d.docName||'').replace(/'/g,"\\'")}','${(d.content||'').substring(0,100)}')">
        <div class="doc-item-name">📄 ${d.docName||'-'}</div>
        ${d.note?`<div style="font-size:11px;color:var(--cyan);margin-top:4px;font-style:italic">"${d.note}"</div>`:''}
      </div>
    </div>`).join('');
}

function openSharedDocDetail(id,nama,contentPreview){
  currentShareDocId=id;
  const d=allShared.find(x=>x.id===id)||{};
  document.getElementById('modalDocDetailTitle').textContent='📄 '+(d.docName||nama);
  document.getElementById('modalDocContent').innerHTML=d.content||contentPreview||'<em>Tidak ada konten</em>';
  document.getElementById('modalComments').innerHTML=renderComments(d.comments||[]);
  openModal('modalDocDetail');
}
function renderComments(comments){
  if(!comments||comments.length===0) return '<div style="color:var(--muted);font-size:11px;text-align:center;padding:8px">Belum ada komentar</div>';
  return comments.map(c=>`<div class="comment-item"><div class="comment-avatar">👤</div><div class="comment-body"><div class="comment-author">${c.author||'-'}</div><div class="comment-text">${c.text||''}</div></div></div>`).join('');
}
async function submitComment(){
  const input=document.getElementById('commentInput');
  const text=input.value.trim();
  if(!text||!currentShareDocId) return;
  const{doc,getDoc,updateDoc,serverTimestamp}=window._fb;
  const snap=await getDoc(doc(db,'shared_docs',currentShareDocId));
  if(!snap.exists()) return;
  const comments=[...(snap.data().comments||[]),{author:userData.nama,text,time:new Date().toISOString()}];
  await updateDoc(doc(db,'shared_docs',currentShareDocId),{comments});
  const idx=allShared.findIndex(x=>x.id===currentShareDocId);
  if(idx>-1) allShared[idx].comments=comments;
  document.getElementById('modalComments').innerHTML=renderComments(comments);
  input.value='';
}
function downloadSharedDoc(){
  const d=allShared.find(x=>x.id===currentShareDocId);
  if(!d) return;
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${d.docName}</title>
    <style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;padding:2cm}</style>
    </head><body><h2>${d.docName}</h2><p><em>Dibuat oleh: ${d.sharedBy}</em></p><hr/>${d.content}</body></html>`;
  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=d.docName+'.html'; a.click();
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════
// ★ BARU: LAPORAN KEUANGAN (bendahara)
// ══════════════════════════════════════════
async function loadLaporanKeu(){
  const{collection,getDocs,query,where,orderBy}=window._fb;
  // Update stat
  const keuDocs=_kontenCache['keuangan']||[];
  const evalDocs=_kontenCache['evaluasi']||[];
  const el1=document.getElementById('statKeuDoc');
  const el2=document.getElementById('statEvalDoc');
  if(el1) el1.textContent=keuDocs.length;
  if(el2) el2.textContent=evalDocs.length;

  const listEl=document.getElementById('laporanKeuList');
  if(!listEl) return;
  listEl.innerHTML='<div class="empty-state"><div class="spinner"></div></div>';
  try{
    const snap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah),where('target','==','bendahara'),orderBy('sharedAt','desc')));
    if(snap.empty){
      listEl.innerHTML='<div class="empty-state"><div class="icon">💰</div><p>Belum ada dokumen keuangan masuk</p></div>';
      return;
    }
    const items=[];
    snap.forEach(d=>{
      const data=d.data();
      items.push({id:d.id,...data});
      allShared.push({id:d.id,...data});
    });
    listEl.innerHTML=items.map(d=>`
      <div class="approval-card" onclick="openSharedDocDetail('${d.id}','${(d.docName||'').replace(/'/g,"\\'")}','')">
        <div style="font-size:22px">💰</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;color:var(--text)">${d.docName||'-'}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">dari ${d.sharedBy||'-'} · ${fmtDate(d.sharedAt)}</div>
          ${d.note?`<div style="font-size:11px;color:var(--gold);margin-top:3px;font-style:italic">"${d.note}"</div>`:''}
        </div>
        <span class="badge badge-keuangan">${d.kategori||'Keuangan'}</span>
      </div>`).join('');
  }catch(e){
    listEl.innerHTML='<div class="empty-state"><div class="icon">⚠️</div><p>Gagal memuat data keuangan</p></div>';
  }
}

// ── Submission guru ke kepsek ───────────────
async function loadMySubmissions(){
  const{collection,getDocs,query,where,orderBy}=window._fb;
  const listEl=document.getElementById('submissionList');
  listEl.innerHTML='<div class="empty-state"><div class="spinner"></div></div>';
  try{
    const snap=await getDocs(query(collection(db,'shared_docs'),where('sharedById','==',userData.id),where('target','in',['kepsek','approval']),orderBy('sharedAt','desc')));
    if(snap.empty){listEl.innerHTML='<div class="empty-state"><div class="icon">📬</div><p>Belum ada dokumen dikirim ke kepsek</p></div>';return;}
    let html='';
    snap.forEach(d=>{
      const data=d.data();
      const sMap={shared:'Dipantau Kepsek',pending:'Menunggu',approved:'✅ Disetujui',rejected:'❌ Ditolak'};
      html+=`<div class="approval-card"><div style="font-size:22px">📄</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--text)">${data.docName}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${data.kategori} · ${fmtDate(data.sharedAt)}</div></div>
        <span class="badge badge-${data.status==='approved'?'approved':data.status==='rejected'?'rejected':'pending'}">${sMap[data.status]||data.status}</span>
      </div>`;
    });
    listEl.innerHTML=html;
  }catch(e){listEl.innerHTML='<div class="empty-state"><p>Gagal memuat</p></div>';}
}

// ── Monitor Guru (kepsek) ──────────────────
async function loadMonitor(){
  const{collection,getDocs,query,where}=window._fb;
  const listEl=document.getElementById('monitorList');
  listEl.innerHTML='<div class="empty-state"><div class="spinner"></div></div>';
  try{
    const guruSnap=await getDocs(query(collection(db,'users'),where('sekolah','==',userData.sekolah)));
    const sharedSnap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah)));
    const allDocs=[];
    sharedSnap.forEach(d=>allDocs.push({id:d.id,...d.data()}));
    let html='';
    guruSnap.forEach(gDoc=>{
      const guru=gDoc.data();
      const roles=guru.roles||[guru.role];
      if(roles.includes('admin')||roles.includes('kepsek')) return;
      const docs=allDocs.filter(d=>d.sharedById===gDoc.id);
      html+=`<div class="approval-card" onclick="loadGuruDocs('${gDoc.id}','${guru.nama||''}')">
        <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${roles.includes('bendahara')?'💰':'👨‍🏫'}</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;color:var(--text)">${guru.nama||'-'}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${roles.map(r=>({guru:'Guru',kepsek:'Kepsek',bendahara:'Bendahara',ops:'Operator'}[r]||r)).join(' · ')}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Orbitron',sans-serif;font-size:16px;color:var(--cyan)">${docs.length}</div>
          <div style="font-size:10px;color:var(--muted)">Dokumen</div>
        </div>
      </div>`;
    });
    document.getElementById('monitorList').innerHTML=html||'<div class="empty-state"><div class="icon">👨‍🏫</div><p>Belum ada data</p></div>';
  }catch(e){listEl.innerHTML='<div class="empty-state"><p>Gagal memuat</p></div>';}
}
async function loadGuruDocs(guruId,guruNama){
  const{collection,getDocs,query,where,orderBy}=window._fb;
  const snap=await getDocs(query(collection(db,'shared_docs'),where('sharedById','==',guruId),orderBy('sharedAt','desc')));
  let html=`<div class="back-btn" style="margin-bottom:12px;display:inline-flex;cursor:pointer" onclick="loadMonitor()">← Kembali</div>
    <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:10px">Dokumen dari ${guruNama}</div>`;
  snap.forEach(d=>{
    const data=d.data();
    const sMap={shared:'Dibagikan',pending:'Menunggu',approved:'Disetujui',rejected:'Ditolak'};
    html+=`<div class="approval-card" onclick="openSharedDocKepsek('${d.id}')">
      <div style="font-size:20px">📄</div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600;color:var(--text)">${data.docName}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${data.kategori} · ${fmtDate(data.sharedAt)}</div>
      </div>
      <span class="badge badge-${data.status==='approved'?'approved':data.status==='rejected'?'rejected':'pending'}">${sMap[data.status]||data.status}</span>
    </div>`;
  });
  if(snap.empty) html+='<div class="empty-state"><div class="icon">📄</div><p>Belum ada dokumen</p></div>';
  document.getElementById('monitorList').innerHTML=html;
}
async function openSharedDocKepsek(docId){
  const{doc,getDoc}=window._fb;
  const snap=await getDoc(doc(db,'shared_docs',docId));
  if(!snap.exists()) return;
  const d={id:docId,...snap.data()};
  if(!allShared.find(x=>x.id===docId)) allShared.push(d);
  currentShareDocId=docId;
  document.getElementById('modalDocDetailTitle').textContent='📄 '+d.docName;
  document.getElementById('modalDocContent').innerHTML=d.content||'<em>Tidak ada konten</em>';
  document.getElementById('modalComments').innerHTML=renderComments(d.comments||[]);
  openModal('modalDocDetail');
}

// ── Approval (kepsek) ──────────────────────
async function loadApprovals(statusFilter='pending'){
  const{collection,getDocs,query,where,orderBy}=window._fb;
  const listEl=document.getElementById('approvalList');
  listEl.innerHTML='<div class="empty-state"><div class="spinner"></div></div>';
  try{
    const snap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah),where('target','==','approval'),where('status','==',statusFilter),orderBy('sharedAt','desc')));
    allApprovals=[];
    snap.forEach(d=>allApprovals.push({id:d.id,...d.data()}));
    renderApprovals();
    if(statusFilter==='pending'){
      const badge=document.getElementById('approvalBadge');
      if(badge){badge.style.display=allApprovals.length>0?'':'none';badge.textContent=allApprovals.length;}
    }
  }catch(e){listEl.innerHTML='<div class="empty-state"><p>Gagal memuat</p></div>';}
}
function filterApproval(f){
  ['pending','approved','rejected'].forEach(k=>{
    document.getElementById('af'+k.charAt(0).toUpperCase()+k.slice(1))?.classList.toggle('active',k===f);
  });
  loadApprovals(f);
}
function renderApprovals(){
  const listEl=document.getElementById('approvalList');
  if(allApprovals.length===0){listEl.innerHTML='<div class="empty-state"><div class="icon">✅</div><p>Tidak ada dokumen</p></div>';return;}
  listEl.innerHTML=allApprovals.map(d=>`
    <div class="approval-card">
      <div style="font-size:22px">📄</div>
      <div style="flex:1;cursor:pointer" onclick="openSharedDocKepsek('${d.id}')">
        <div style="font-size:13px;font-weight:600;color:var(--text)">${d.docName}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${d.sharedBy} · ${d.kategori} · ${fmtDate(d.sharedAt)}</div>
        ${d.note?`<div style="font-size:11px;color:var(--cyan);margin-top:3px;font-style:italic">"${d.note}"</div>`:''}
      </div>
      ${d.status==='pending'?`<div style="display:flex;gap:6px">
        <button class="btn btn-success btn-sm" onclick="approveDoc('${d.id}')">✅ Setujui</button>
        <button class="btn btn-danger btn-sm" onclick="rejectDoc('${d.id}')">❌ Tolak</button>
      </div>`:`<span class="badge badge-${d.status==='approved'?'approved':'rejected'}">${d.status==='approved'?'Disetujui':'Ditolak'}</span>`}
    </div>`).join('');
}
async function approveDoc(id){
  const{doc,updateDoc,serverTimestamp}=window._fb;
  await updateDoc(doc(db,'shared_docs',id),{status:'approved',approvedBy:userData.nama,approvedAt:serverTimestamp()});
  loadApprovals('pending');
  showToast('success','Disetujui','Dokumen berhasil divalidasi');
}
async function rejectDoc(id){
  const{doc,updateDoc,serverTimestamp}=window._fb;
  await updateDoc(doc(db,'shared_docs',id),{status:'rejected',rejectedBy:userData.nama,rejectedAt:serverTimestamp()});
  loadApprovals('pending');
  showToast('warn','Ditolak','Dokumen dikembalikan');
}

// ── Rekap ──────────────────────────────────
async function loadRekap(){
  const{collection,getDocs,query,where}=window._fb;
  const el=document.getElementById('rekapContent');
  el.innerHTML='<div class="empty-state"><div class="spinner"></div></div>';
  try{
    const guruSnap=await getDocs(query(collection(db,'users'),where('sekolah','==',userData.sekolah)));
    const sharedSnap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah)));
    const allDocs=[];
    sharedSnap.forEach(d=>allDocs.push({id:d.id,...d.data()}));
    let html='<div class="card"><div class="card-header"><div class="card-title">📊 REKAP PER PENGGUNA</div></div><div class="card-body">';
    guruSnap.forEach(gDoc=>{
      const guru=gDoc.data();
      const roles=guru.roles||[guru.role];
      if(roles.includes('admin')) return;
      const docs=allDocs.filter(d=>d.sharedById===gDoc.id);
      const roleLabel=roles.includes('kepsek')?'🏛️ Kepsek':roles.includes('bendahara')?'💰 Bendahara':roles.includes('ops')?'💻 Operator':'👨‍🏫 Guru';
      html+=`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(0,229,255,0.07)">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:16px">${roles.includes('bendahara')?'💰':'👤'}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:700;color:#fff">${guru.nama||'-'}</div>
          <div style="font-size:10px;color:var(--muted)">${roleLabel} · ${guru.sekolah||''}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Orbitron',sans-serif;font-size:16px;color:var(--cyan)">${docs.length}</div>
          <div style="font-size:10px;color:var(--muted)">Dokumen</div>
        </div>
      </div>`;
    });
    html+='</div></div>';
    el.innerHTML=html;
  }catch(e){el.innerHTML='<div class="empty-state"><p>Gagal memuat rekap</p></div>';}
}

// ── Beranda ────────────────────────────────
function loadBeranda(){
  const roles=userData.roles;
  const isBendahara=roles.includes('bendahara');
  const isKepsek=roles.includes('kepsek');
  const isOps=roles.includes('ops');
  const roleLabel=isKepsek?'Kepala Sekolah':isBendahara?'Bendahara':isOps?'Operator':'Guru';
  const roleIcon=isKepsek?'🏛️':isBendahara?'💰':isOps?'💻':'👨‍🏫';
  document.getElementById('welcomeAvatar').textContent=roleIcon;
  document.getElementById('welcomeName').textContent='Selamat datang, '+userData.nama+'!';
  document.getElementById('welcomeSub').textContent=userData.sekolah+' — '+roleLabel;
  const now=new Date();
  document.getElementById('welcomeDate').innerHTML=now.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'<br/><span style="font-size:10px;color:var(--cyan)">'+now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+'</span>';
  const total=_menuDataDynamic.reduce((a,m)=>a+m.items.length,0);
  let statsHtml=[
    {icon:'📂',num:_menuDataDynamic.length,label:'Kategori Menu'},
    {icon:'📄',num:total,label:'Total Dokumen'},
  ].map(s=>`<div class="stat-card"><div class="stat-icon">${s.icon}</div><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`).join('');
  // ★ BARU: stat khusus bendahara
  if(isBendahara){
    const keuDocs=(_kontenCache['keuangan']||[]).length+(_kontenCache['evaluasi']||[]).length;
    statsHtml+=`<div class="stat-card" style="cursor:pointer;border-color:rgba(255,208,0,0.2)" onclick="navTo(null,'keuangan','LAPORAN KEUANGAN',loadLaporanKeu)"><div class="stat-icon">💰</div><div class="stat-num" style="color:var(--gold)">${keuDocs}</div><div class="stat-label">Dok. Keuangan</div></div>`;
  }
  if(isKepsek){
    statsHtml+=`<div class="stat-card"><div class="stat-icon">👁️</div><div class="stat-num">Monitor</div><div class="stat-label">Aktivitas Guru</div></div>`;
  }
  document.getElementById('homeStats').innerHTML=statsHtml;
  // FIX: onclick hanya pakai m.id, bukan JSON.stringify(m.items)
  document.getElementById('quickMenuHome').innerHTML=_menuDataDynamic.slice(0,4).map(m=>`
    <div style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid rgba(0,229,255,0.06);cursor:pointer"
      onclick="openDocList('${m.id}')">
      <span style="font-size:16px">${m.icon}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--text)">${m.title}</div><div style="font-size:10px;color:var(--muted)">${m.items.length} dokumen</div></div>
      <span style="color:var(--muted);font-size:11px">▶</span>
    </div>`).join('');
}

// ── Profil ─────────────────────────────────
async function loadProfil(){
  const{doc,getDoc}=window._fb;
  try{
    const snap=await getDoc(doc(db,'users',userData.id));
    if(!snap.exists()) return;
    const data=snap.data();
    const roles=data.roles||[data.role||'guru'];
    // ★ BARU: roleMap profil dengan bendahara
    const roleMap={guru:'👨‍🏫 Guru',kepsek:'🏛️ Kepsek',bendahara:'💰 Bendahara',ops:'💻 Operator'};
    document.getElementById('profilAvatar').textContent=roles.includes('bendahara')?'💰':roles.includes('kepsek')?'🏛️':'👨‍🏫';
    document.getElementById('profilNama').textContent=data.nama;
    document.getElementById('profilRoleBadge').innerHTML=roles.map(r=>`<span class="badge badge-approved" style="margin:2px">${roleMap[r]||r}</span>`).join('');
    document.getElementById('profilSekolah').textContent=data.sekolah;
    document.getElementById('profilUsername').textContent=data.username;
    const exp=data.expired?(data.expired.toDate?data.expired.toDate():new Date(data.expired)):null;
    document.getElementById('profilExpired').textContent=exp?exp.toLocaleDateString('id-ID'):'-';
    document.getElementById('profilStatus').innerHTML=`<span class="badge badge-${data.status==='aktif'?'approved':'rejected'}">${data.status}</span>`;
  }catch(e){}
}
async function gantiPasswordUser(){
  const{collection,query,where,getDocs,doc,updateDoc,serverTimestamp}=window._fb;
  const old=document.getElementById('oldPassUser').value;
  const nw=document.getElementById('newPassUser').value;
  const conf=document.getElementById('confirmPassUser').value;
  if(!old||!nw||!conf){showToast('warn','Peringatan','Semua field harus diisi!');return;}
  if(nw!==conf){showToast('warn','Peringatan','Password baru tidak cocok!');return;}
  if(nw.length<6){showToast('warn','Peringatan','Minimal 6 karakter!');return;}
  try{
    const snap=await getDocs(query(collection(db,'users'),where('username','==',userData.username)));
    if(snap.empty){showToast('error','Error','Akun tidak ditemukan!');return;}
    const userDoc=snap.docs[0];
    if(userDoc.data().password!==old){showToast('error','Gagal','Password lama salah!');return;}
    await updateDoc(doc(db,'users',userDoc.id),{password:nw,updatedAt:serverTimestamp()});
    ['oldPassUser','newPassUser','confirmPassUser'].forEach(id=>document.getElementById(id).value='');
    showToast('success','Berhasil','Password berhasil diperbarui!');
  }catch(e){showToast('error','Error','Gagal ubah password: '+e.message);}
}

// ── Notifikasi ─────────────────────────────
function toggleNotif(){document.getElementById('notifPanel').classList.toggle('show');}
document.addEventListener('click',e=>{if(!e.target.closest('#notifPanel')&&!e.target.closest('#notifBtn')) document.getElementById('notifPanel').classList.remove('show');});
async function loadNotifications(){
  const{collection,getDocs,query,where,orderBy}=window._fb;
  const roles=userData.roles;
  try{
    const snap=await getDocs(query(collection(db,'notifications'),orderBy('sentAt','desc')));
    const items=[];
    snap.forEach(d=>{
      const data=d.data();
      // ★ BARU: filter notif untuk bendahara
      const forMe=data.target==='all'||roles.includes(data.target);
      if(!forMe) return;
      items.push(data);
    });
    if(items.length>0){
      document.getElementById('notifDot').classList.add('show');
      const icons={info:'ℹ️',success:'✅',warn:'⚠️',error:'❌'};
      document.getElementById('notifList').innerHTML=items.slice(0,8).map(n=>`
        <div class="notif-item"><div style="font-size:12px;font-weight:600;color:var(--text)">${icons[n.type]||'ℹ️'} ${n.title}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${n.message}</div></div>`).join('');
      document.getElementById('recentNotifHome').innerHTML=items.slice(0,3).map(n=>`
        <div style="padding:8px 0;border-bottom:1px solid rgba(0,229,255,0.06)">
          <div style="font-size:12px;font-weight:600;color:var(--text)">${icons[n.type]||'ℹ️'} ${n.title}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${n.message}</div>
        </div>`).join('');
    }
  }catch(e){}
}

// ── Update banner ──────────────────────────
async function checkUpdate(){
  const{doc,getDoc}=window._fb;
  try{
    const appConfig=await window.cimegaAPI.getAppConfig();
    const snap=await getDoc(doc(db,'appConfig','version'));
    if(!snap.exists()) return;
    const data=snap.data();
    if(data.current!==appConfig.appVersion){
      document.getElementById('updateBanner').classList.add('show');
      document.getElementById('updateTitle').textContent=`🚀 Update v${data.current} Tersedia!`;
      document.getElementById('updateDesc').textContent=data.releaseNotes||'Versi baru siap diunduh';
      if(data.forceUpdate) document.getElementById('skipUpdateBtn').style.display='none';
      window._updateUrl=data.downloadUrl;
    }
  }catch(e){}
}
function doUpdate(){if(window._updateUrl) window.cimegaAPI.openExternal(window._updateUrl);}

// ── Helper ─────────────────────────────────
function fmtDate(ts){
  if(!ts) return '-';
  const d=ts.toDate?ts.toDate():new Date(ts);
  return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
}
function doLogout(){
  if(confirm('Keluar dari aplikasi?')){localStorage.removeItem('cimega_user');window.location.href='../login/login.html';}
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// AI ASISTEN
// ══════════════════════════════════════════

let _chatHistory = [];

function switchAiTab(tab, el) {
  document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.ai-panel').forEach(p => p.style.display = 'none');
  document.getElementById('aiPanel-' + tab).style.display = '';
}

function setAiLoading(elId, loading) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (loading) {
    el.innerHTML = `<div class="ai-loading">
      <div class="ai-loading-dot"></div>
      <div class="ai-loading-dot"></div>
      <div class="ai-loading-dot"></div>
      <span style="margin-left:6px">AI sedang menulis...</span>
    </div>`;
  }
}

function showAiResult(elId, text, copyBtnId, saveBtnId) {
  const el = document.getElementById(elId);
  if (el) el.textContent = text;
  if (copyBtnId) { const b = document.getElementById(copyBtnId); if(b) b.style.display = ''; }
  if (saveBtnId) { const b = document.getElementById(saveBtnId); if(b) b.style.display = ''; }
}

function copyAiResult(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent || '').then(() => {
    showToast('success', 'Tersalin', 'Teks berhasil disalin ke clipboard');
  }).catch(() => {
    showToast('warn', 'Gagal', 'Tidak bisa menyalin otomatis');
  });
}

function saveAiResult(elId, tipe) {
  const el = document.getElementById(elId);
  if (!el || !el.textContent.trim()) return;
  // Simpan ke konten shared (bisa dikembangkan)
  showToast('info', 'Petunjuk', 'Copy teks lalu paste ke editor dokumen Anda');
}

// ── Generate RPP / Modul Ajar ──────────────
async function generateRPP() {
  const docType  = document.getElementById('aiDocType').value;
  const mapel    = document.getElementById('aiMapel').value;
  const kelas    = document.getElementById('aiKelas').value;
  const semester = document.getElementById('aiSemester').value;
  const materi   = document.getElementById('aiMateri').value.trim();
  const waktu    = document.getElementById('aiWaktu').value.trim();
  const catatan  = document.getElementById('aiCatatan').value.trim();

  if (!materi) { showToast('warn', 'Perlu diisi', 'Isi kolom Materi / Tema terlebih dahulu'); return; }

  const docNames = {
    rpp_dl: 'RPP Deep Learning', modul_merdeka: 'Modul Ajar Kurikulum Merdeka',
    modul_kemenag: 'Modul Ajar Kurikulum Berbasis Cinta (KEMENAG)',
    rpp_k13: 'RPP Kurikulum 2013', prota: 'Program Tahunan (PROTA)',
    promes: 'Program Semester (PROMES)', atp: 'Alur Tujuan Pembelajaran (ATP)',
    silabus: 'Silabus',
  };

  const btn = document.getElementById('aiRppBtn');
  btn.disabled = true; btn.textContent = '⏳ Generating...';
  setAiLoading('aiRppResult', true);

  const prompt = `Buatkan ${docNames[docType]} yang lengkap dan detail untuk:
- Satuan Pendidikan: SDN Cimega, Kp.Bojongloa Desa Sarinagen, Kec.Cipongkor, Kab.Bandung Barat
- Mata Pelajaran: ${mapel}
- Kelas / Fase: ${kelas}
- Semester: ${semester}
- Materi / Tema: ${materi}
- Alokasi Waktu: ${waktu || '2 x 35 menit'}
${catatan ? '- Catatan: ' + catatan : ''}

Buat dokumen yang lengkap, profesional, dan siap pakai. Sertakan semua komponen yang diperlukan sesuai format dokumen tersebut.`;

  try {
    const res = await window.cimegaAPI.claudeAsk({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 3000,
    });
    if (res.error) {
      showAiResult('aiRppResult', '❌ Error: ' + res.error);
      showToast('error', 'Gagal', res.error);
    } else {
      showAiResult('aiRppResult', res.text, 'aiRppCopyBtn', 'aiRppSaveBtn');
      showToast('success', 'Selesai', docNames[docType] + ' berhasil digenerate');
    }
  } catch(e) {
    showAiResult('aiRppResult', '❌ Error: ' + e.message);
  }
  btn.disabled = false; btn.textContent = '✨ Generate dengan AI';
}

// ── Generate SK & Surat ────────────────────
async function generateSurat() {
  const suratType = document.getElementById('aiSuratType').value;
  const tahun     = document.getElementById('aiTahun').value.trim();
  const detail    = document.getElementById('aiSuratDetail').value.trim();
  const catatan   = document.getElementById('aiSuratCatatan').value.trim();

  if (!detail) { showToast('warn', 'Perlu diisi', 'Isi kolom Detail Isi terlebih dahulu'); return; }

  const suratNames = {
    sk_tugas: 'SK Pembagian Tugas Mengajar', sk_wali: 'SK Wali Kelas',
    sk_panitia: 'SK Panitia Ujian', sk_ekskul: 'SK Ekstrakurikuler',
    sk_bos: 'SK Tim BOS', notulen: 'Notulen Rapat',
    laporan: 'Laporan Kegiatan', berita_acara: 'Berita Acara', lpj: 'LPJ Kegiatan',
  };

  const btn = document.getElementById('aiSuratBtn');
  btn.disabled = true; btn.textContent = '⏳ Generating...';
  setAiLoading('aiSuratResult', true);

  const prompt = `Buatkan ${suratNames[suratType]} yang lengkap dan profesional untuk:
- Satuan Pendidikan: SDN Cimega
- Alamat: Kp.Bojongloa Desa Sarinagen, Kec.Cipongkor, Kab.Bandung Barat 40564
- Tahun Pelajaran / Anggaran: ${tahun}
- Detail: ${detail}
${catatan ? '- Catatan: ' + catatan : ''}

Buat dokumen lengkap dengan format resmi, nomor surat, kop surat (teks), dan tanda tangan yang sesuai.`;

  try {
    const res = await window.cimegaAPI.claudeAsk({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 2500,
    });
    if (res.error) {
      showAiResult('aiSuratResult', '❌ Error: ' + res.error);
      showToast('error', 'Gagal', res.error);
    } else {
      showAiResult('aiSuratResult', res.text, 'aiSuratCopyBtn', 'aiSuratSaveBtn');
      showToast('success', 'Selesai', suratNames[suratType] + ' berhasil digenerate');
    }
  } catch(e) {
    showAiResult('aiSuratResult', '❌ Error: ' + e.message);
  }
  btn.disabled = false; btn.textContent = '✨ Generate dengan AI';
}

// ── Chatbot Kurikulum ──────────────────────
function appendChat(role, text) {
  const el = document.getElementById('chatMessages');
  if (!el) return;
  const div = document.createElement('div');
  div.className = 'chat-msg chat-' + role;
  div.innerHTML = `<div class="chat-bubble">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>')}</div>`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
  return div;
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  appendChat('user', text);
  _chatHistory.push({ role: 'user', content: text });

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg chat-ai chat-typing';
  typingDiv.innerHTML = `<div class="chat-bubble"><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div><div class="ai-loading-dot"></div></div>`;
  document.getElementById('chatMessages').appendChild(typingDiv);
  document.getElementById('chatMessages').scrollTop = 999999;

  try {
    const res = await window.cimegaAPI.claudeAsk({
      system: `Kamu adalah asisten AI untuk guru dan staf SDN Cimega, sekolah dasar di Kec.Cipongkor, Kab.Bandung Barat, Jawa Barat.
Kamu ahli dalam:
- Kurikulum Merdeka Belajar (Kemendikdasmen) dan Kurikulum Berbasis Cinta (Kemenag)
- Penyusunan RPP, Modul Ajar, ATP, PROTA, PROMES
- Administrasi sekolah (SK, notulen, laporan, LPJ)
- Keuangan BOS dan pelaporan
- Asesmen formatif & sumatif, Profil Pelajar Pancasila
Jawab dengan ramah, padat, dan profesional dalam Bahasa Indonesia.`,
      messages: _chatHistory.slice(-10), // Kirim 10 pesan terakhir sebagai konteks
      maxTokens: 1500,
    });
    typingDiv.remove();
    const reply = res.error ? '❌ ' + res.error : res.text;
    appendChat('ai', reply);
    _chatHistory.push({ role: 'assistant', content: reply });
  } catch(e) {
    typingDiv.remove();
    appendChat('ai', '❌ Error: ' + e.message);
  }
}

// ── Analisis Nilai ─────────────────────────
async function generateAnalisis() {
  const tipe  = document.getElementById('aiAnalisisType').value;
  const mapel = document.getElementById('aiAnalisisMapel').value.trim();
  const kelas = document.getElementById('aiAnalisisKelas').value.trim();
  const kkm   = document.getElementById('aiAnalisisKKM').value.trim();
  const nilai = document.getElementById('aiAnalisisNilai').value.trim();

  if (!nilai) { showToast('warn', 'Perlu diisi', 'Masukkan data nilai siswa terlebih dahulu'); return; }
  if (!mapel) { showToast('warn', 'Perlu diisi', 'Isi nama mata pelajaran'); return; }

  const tipeNames = {
    rekap: 'Rekap & Statistik Kelas', remedial: 'Identifikasi Siswa Remedial',
    rapor: 'Deskripsi Rapor per Siswa', progres: 'Analisis Progres Belajar',
  };

  const btn = document.querySelector('#aiPanel-analisis button.btn-primary');
  btn.disabled = true; btn.textContent = '⏳ Menganalisis...';
  setAiLoading('aiAnalisisResult', true);

  const prompts = {
    rekap: `Buat rekap dan statistik lengkap dari data nilai berikut:
- Mata Pelajaran: ${mapel}
- Kelas: ${kelas}
- KKM: ${kkm}

Data nilai:
${nilai}

Sertakan: nilai tertinggi, terendah, rata-rata, jumlah tuntas & tidak tuntas, persentase ketuntasan, dan rekomendasi tindak lanjut.`,
    remedial: `Identifikasi siswa yang perlu remedial dari data nilai berikut:
- Mata Pelajaran: ${mapel}
- Kelas: ${kelas}
- KKM: ${kkm}

Data nilai:
${nilai}

Sertakan: daftar siswa remedial, selisih dari KKM, materi yang perlu diulang, dan strategi remedial yang disarankan.`,
    rapor: `Buatkan deskripsi narasi rapor untuk setiap siswa dari data nilai berikut:
- Mata Pelajaran: ${mapel}
- Kelas: ${kelas}
- KKM: ${kkm}

Data nilai:
${nilai}

Buat deskripsi yang personal, positif, dan konstruktif sesuai format Kurikulum Merdeka.`,
    progres: `Analisis progres belajar siswa dari data nilai berikut:
- Mata Pelajaran: ${mapel}
- Kelas: ${kelas}
- KKM: ${kkm}

Data nilai:
${nilai}

Berikan: analisis capaian kelas, kelompok siswa (tinggi/sedang/rendah), rekomendasi diferensiasi pembelajaran.`,
  };

  try {
    const res = await window.cimegaAPI.claudeAsk({
      messages: [{ role: 'user', content: prompts[tipe] }],
      maxTokens: 3000,
    });
    if (res.error) {
      showAiResult('aiAnalisisResult', '❌ Error: ' + res.error);
      showToast('error', 'Gagal', res.error);
    } else {
      showAiResult('aiAnalisisResult', res.text, 'aiAnalisisCopyBtn');
      showToast('success', 'Selesai', tipeNames[tipe] + ' selesai dianalisis');
    }
  } catch(e) {
    showAiResult('aiAnalisisResult', '❌ Error: ' + e.message);
  }
  btn.disabled = false; btn.textContent = '✨ Analisis dengan AI';
}


// ── Tambahan Fungsi AI (Kepsek, Bendahara, Ops) ──────────

async function generateKepsek() {
  const tipe  = document.getElementById('aiKepsekType').value;
  const sasaran = document.getElementById('aiKepsekSasaran').value.trim();
  const tahun = document.getElementById('aiKepsekTahun').value.trim();
  const catatan = document.getElementById('aiKepsekCatatan').value.trim();

  const tipeNames = {rkt:'Rencana Kerja Tahunan (RKT)', rkjm:'Rencana Kerja Jangka Menengah (RKJM)', supervisi:'Instrumen Supervisi Akademik', pkg:'Penilaian Kinerja Guru (PKG)', laporan:'Laporan Bulanan Kepala Sekolah'};
  
  const btn = document.querySelector('#aiPanel-kepsek button.btn-primary');
  btn.disabled = true; btn.textContent = '⏳ Generating...';
  setAiLoading('aiKepsekResult', true);

  const prompt = `Buatkan ${tipeNames[tipe]} untuk Kepala Sekolah secara lengkap dan profesional dengan format tabel HTML resmi:
- Satuan Pendidikan: SDN Cimega, Kp.Bojongloa Desa Sarinagen, Kec.Cipongkor, Kab.Bandung Barat
- Tahun / Periode: ${tahun}
${sasaran ? '- Nama Sasaran / Guru: ' + sasaran : ''}
${catatan ? '- Fokus / Catatan: ' + catatan : ''}

Ketentuan Khusus:
Buat keseluruhan isinya langsung menggunakan tag tabel HTML (\`<table>, <th>, <td>, dsb\`) yang rapi, solid, profesional. Jangan gunakan bahasa pengantar AI, langsung outputkan HTML. Gunakan bahasa Indonesia resmi (Tata bahasa Kemdikbud).`;

  try {
    const res = await window.cimegaAPI.claudeAsk({ messages: [{ role: 'user', content: prompt }], maxTokens: 3000 });
    if (res.error) { showAiResult('aiKepsekResult', '❌ Error: ' + res.error); showToast('error', 'Gagal', res.error); } 
    else { showAiResult('aiKepsekResult', res.text, 'aiKepsekCopyBtn'); showToast('success', 'Selesai', 'Dokumen manajerial selesai'); }
  } catch(e) { showAiResult('aiKepsekResult', '❌ Error: ' + e.message); }
  btn.disabled = false; btn.textContent = '✨ Generate Dokumen Kepsek';
}

async function generateBendahara() {
  const tipe  = document.getElementById('aiBendaharaType').value;
  const bulan = document.getElementById('aiBendaharaBulan').value.trim();
  const masuk = document.getElementById('aiBendaharaMasuk').value.trim();
  const rincian = document.getElementById('aiBendaharaRincian').value.trim();

  const tipeNames = {rkas:'Draft RKAS BOS Reguler', bku:'Buku Kas Umum (BKU)', bapk:'Berita Acara Pemeriksaan Kas', spj:'Draft SPJ Honor/Kegiatan', pajak:'Rekapitulasi Pajak Belanja'};
  
  const btn = document.querySelector('#aiPanel-bendahara button.btn-primary');
  btn.disabled = true; btn.textContent = '⏳ Generating...';
  setAiLoading('aiBendaharaResult', true);

  const prompt = `Buatkan ${tipeNames[tipe]} untuk Bendahara Sekolah secara lengkap dengan format tabel HTML resmi:
- Satuan Pendidikan: SDN Cimega, Kec.Cipongkor, Kab.Bandung Barat
- Bulan / Periode: ${bulan}
${masuk ? '- Pemasukan / Saldo Awal: ' + masuk : ''}
${rincian ? '- Uraian Transaksi Utama: ' + rincian : ''}

Ketentuan Khusus:
Buat dokumen pembukuan laporan keuangan yang detail dan komplit. Tampilkan seluruh rancangannya menggunakan DOKUMEN HTML murni berbasis tabel berformat standar BKU/RKAS Dana BOS. Hitung matematisnya jika memungkinkan (logis angka). Jangan ada pengantar AI.`;

  try {
    const res = await window.cimegaAPI.claudeAsk({ messages: [{ role: 'user', content: prompt }], maxTokens: 3000 });
    if (res.error) { showAiResult('aiBendaharaResult', '❌ Error: ' + res.error); showToast('error', 'Gagal', res.error); } 
    else { showAiResult('aiBendaharaResult', res.text, 'aiBendaharaCopyBtn'); showToast('success', 'Selesai', 'Laporan keuangan selesai'); }
  } catch(e) { showAiResult('aiBendaharaResult', '❌ Error: ' + e.message); }
  btn.disabled = false; btn.textContent = '✨ Generate Laporan Keuangan';
}

async function generateOps() {
  const tipe  = document.getElementById('aiOpsType').value;
  const identitas = document.getElementById('aiOpsIdentitas').value.trim();
  const tgl = document.getElementById('aiOpsTgl').value.trim();

  const tipeNames = {mutasi:'Surat Keterangan Pindah Mutasi', absen:'Blangko Absen & Jurnal Kosong', inventaris:'KIB (Kartu Inventaris Barang)', kepanitiaan:'Susunan Kepanitiaan Kelompok Kerja'};
  
  if (!identitas) { showToast('warn', 'Perlu diisi', 'Isi kolom Identitas terlebih dahulu'); return; }

  const btn = document.querySelector('#aiPanel-ops button.btn-primary');
  btn.disabled = true; btn.textContent = '⏳ Generating...';
  setAiLoading('aiOpsResult', true);

  const prompt = `Buatkan ${tipeNames[tipe]} untuk bagian Tata Usaha / Operator Dapodik secara lengkap:
- Satuan Pendidikan: SDN Cimega
- Identitas Terkait (Siswa/Barang/Kegiatan): ${identitas}
- Tanggal Dibuat: ${tgl || '(Kosongi atau beri titik-titik)'}

Ketentuan Khusus:
Gunakan kop surat formal HTML, dan/atau tata letak border-collapse HTML. Jika itu KIB/Buku Induk, buat tabel lebar 100%. Jangan gunakan markdown, langsung outputkan pure code HTML rendering.`;

  try {
    const res = await window.cimegaAPI.claudeAsk({ messages: [{ role: 'user', content: prompt }], maxTokens: 2500 });
    if (res.error) { showAiResult('aiOpsResult', '❌ Error: ' + res.error); showToast('error', 'Gagal', res.error); } 
    else { showAiResult('aiOpsResult', res.text, 'aiOpsCopyBtn'); showToast('success', 'Selesai', 'Dokumen TU selesai'); }
  } catch(e) { showAiResult('aiOpsResult', '❌ Error: ' + e.message); }
  btn.disabled = false; btn.textContent = '✨ Generate Dokumen TU';
}

async function initApp(){
  try{
    const firebaseConfig=await window.cimegaAPI.getFirebaseConfig();
    const{initializeApp}=await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const{getFirestore,collection,doc,getDoc,getDocs,addDoc,updateDoc,deleteDoc,query,where,orderBy,serverTimestamp,Timestamp}=await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const fbApp=initializeApp(firebaseConfig);
    db=getFirestore(fbApp);
    window._fb={collection,doc,getDoc,getDocs,addDoc,updateDoc,deleteDoc,query,where,orderBy,serverTimestamp,Timestamp};

    // Normalisasi roles dari localStorage
    if(!userData.roles) userData.roles=userData.role?[userData.role]:['guru'];

    await loadKontenDynamic();
    setupUser();
    buildSidebar();
    loadBeranda();
    loadNotifications();
    checkUpdate();

    CimegaMusic.init('../../../assets_music/');

    try{
      await CimegaUpdater.init({owner:'prabu26dev',repo:'Cimega_Smart_Office'});
      CimegaUpdater.startChecking(db);
    }catch(e){}

    // Badge approval untuk kepsek
    if(userData.roles.includes('kepsek')){
      try{
        const snap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah),where('target','==','approval'),where('status','==','pending')));
        if(!snap.empty){const b=document.getElementById('approvalBadge');if(b){b.style.display='';b.textContent=snap.size;}}
      }catch(e){}
    }

    // ★ BARU: badge dokumen masuk untuk bendahara
    if(userData.roles.includes('bendahara')){
      try{
        const snap=await getDocs(query(collection(db,'shared_docs'),where('sekolah','==',userData.sekolah),where('target','==','bendahara')));
        if(!snap.empty){
          const submBadge=document.getElementById('submBadge');
          // Tidak ada submBadge khusus bendahara, tapi bisa ditambahkan jika perlu
        }
      }catch(e){}
    }
  }catch(e){console.error('initApp error',e);}
}

initApp();

