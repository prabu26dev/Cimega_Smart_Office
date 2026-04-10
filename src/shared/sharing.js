/**
 * Cimega Doc Sharing - shared/sharing.js
 * Multi-tenant internal document sharing system.
 */

window.CimegaSharing = {
  userData: null,

  init: function() {
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
  },

  share: async function(title, type, content) {
    const schoolId = this.userData.school_id || 'NPSN_MIGRATE';
    
    // 1. Get other users in the same school
    const { collection, getDocs, query, where, addDoc, serverTimestamp } = window._fb;
    let users = [];
    try {
      const q = query(collection(db, 'users'), where('school_id', '==', schoolId));
      const snap = await getDocs(q);
      snap.forEach(d => { if(d.id !== this.userData.id) users.push({ id: d.id, ...d.data() }); });
    } catch(e) { console.error(e); }

    if(users.length === 0) return alert("Hanya ada Anda di sekolah ini. Tidak ada user untuk dibagikan.");

    // 2. Simple UI to pick recipient
    const recipientId = prompt("Pilih Penerima (ID/Nama):\n" + users.map(u => `${u.nama} (${u.roles?.[0] || u.role})`).join("\n"));
    if(!recipientId) return;

    const targetUser = users.find(u => u.nama.includes(recipientId) || u.id === recipientId);
    if(!targetUser) return alert("Penerima tidak ditemukan.");

    try {
      await addDoc(collection(db, 'shared_docs'), {
        sender_id: this.userData.id,
        sender_name: this.userData.nama,
        recipient_id: targetUser.id,
        recipient_name: targetUser.nama,
        school_id: schoolId,
        title: title,
        type: type,
        content: content,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      showToast('success', 'Berhasil', `Dokumen berhasil dibagikan ke ${targetUser.nama}`);
    } catch(e) { showToast('error', 'Gagal Sharing', e.message); }
  },

  renderInbox: async function(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '<div class="spinner"></div>';

    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const q = query(
        collection(db, 'shared_docs'), 
        where('recipient_id', '==', this.userData.id),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      
      let html = '<div class="grid-2" style="gap:10px;">';
      if(snap.empty) html = '<div class="empty-state">Belum ada dokumen yang dibagikan kepada Anda.</div>';
      
      snap.forEach(doc => {
        const d = doc.data();
        html += `
          <div class="card" style="padding:15px; margin-bottom:0; border-color:var(--cyan);">
            <div style="font-size:10px; color:var(--muted); text-transform:uppercase;">DARI: ${d.sender_name}</div>
            <div style="font-size:13px; font-weight:700; color:#fff; margin:5px 0;">${d.title}</div>
            <div style="font-size:11px; color:var(--cyan); margin-bottom:10px;">Jenis: ${d.type}</div>
            <button class="btn btn-ghost btn-sm" onclick="CimegaSharing.view('${doc.id.replace(/'/g, "\\'")}')">👁️ Lihat & Impor</button>
          </div>
        `;
      });
      html += '</div>';
      container.innerHTML = html;
    } catch(e) { container.innerHTML = `<div style="color:var(--danger)">Gagal: ${e.message}</div>`; }
  },

  view: async function(id) {
    const { doc, getDoc } = window._fb;
    const snap = await getDoc(doc(db, 'shared_docs', id));
    if(!snap.exists()) return;
    const d = snap.data();
    
    // Show in modal or print dialog
    CimegaPrinter.showPrintDialog(d.content, d.title);
  }
};
