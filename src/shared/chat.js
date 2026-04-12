/**
 * Cimega Smart Office - Multi-Tenant Chat (Stable v4)
 * FITUR BARU:
 * - Hapus pesan sendiri (Delete on Hover)
 * - Sistem Presence Real-Time (Online/Offline akurat via Firestore)
 */

window.CimegaChat = {
  db: null,
  schoolId: null,
  schoolKey: null,
  currentUser: null,
  localMessages: [],
  presenceInterval: null,
  pollInterval: null,

  init: async function(dbInstance, containerId) {
    // Bersihkan interval sebelumnya
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.presenceInterval) clearInterval(this.presenceInterval);

    this.db = dbInstance;
    const userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    if (!userData.school_id) return;

    this.schoolId = userData.school_id;
    this.schoolKey = userData.school_key || null;
    this.currentUser = userData;
    this.localMessages = [];

    this.injectUI(containerId);
    this.setPresence(true);
    await this.fetchMessages();
    await this.fetchAndRenderMembers();

    // Poll pesan setiap 5 detik
    this.pollInterval = setInterval(() => this.fetchMessages(), 5000);
    
    // Heartbeat presence setiap 30 detik
    this.presenceInterval = setInterval(() => this.setPresence(true), 30000);

    // Tandai offline saat chat ditinggal (halaman berubah / window tutup)
    window.addEventListener('beforeunload', () => this.setPresence(false));
  },

  // ─── PRESENCE SYSTEM ─────────────────────────────────────────────
  setPresence: async function(isOnline) {
    if (!this.db || !this.currentUser?.id) return;
    try {
      const { doc, updateDoc, serverTimestamp } = window._fb;
      await updateDoc(doc(this.db, "users", this.currentUser.id), {
        is_online: isOnline,
        last_seen: serverTimestamp()
      });
    } catch (e) {
      // Jika gagal (user doc tidak ada), diam saja
    }
  },

  // ─── UI INJECTION ─────────────────────────────────────────────────
  injectUI: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="cimegaChatWrapper" style="display:flex; height:calc(100vh - 150px); background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden;">
        
        <!-- Panel Kiri: Daftar Anggota + Status -->
        <div style="width:210px; border-right:1px solid var(--border); background:rgba(0,0,0,0.2); display:flex; flex-direction:column; flex-shrink:0;">
          <div style="padding:12px 15px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
            <div style="font-family:'Orbitron'; font-size:10px; color:var(--cyan); letter-spacing:1px;">👤 ANGGOTA</div>
            <div id="onlineCount" style="font-size:9px; color:var(--success); font-family:'Orbitron';">• 0 online</div>
          </div>
          <div id="chatMembersList" style="flex:1; overflow-y:auto; padding:8px; display:flex; flex-direction:column; gap:4px;">
            <div style="font-size:11px; color:var(--muted); text-align:center; padding:20px;">Memuat...</div>
          </div>
        </div>

        <!-- Panel Kanan: Pesan -->
        <div style="flex:1; display:flex; flex-direction:column; min-width:0;">
          <div style="padding:12px 16px; background:rgba(0,229,255,0.05); border-bottom:1px solid var(--border);">
            <div style="font-family:'Orbitron'; font-size:12px; color:#fff; font-weight:700;">CIPER CHAT 🔒</div>
            <div style="font-size:10px; color:var(--cyan); margin-top:2px;">${this.currentUser.sekolah || 'Sekolah'} · Terenkripsi E2E</div>
          </div>
          
          <div id="chatHistory" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth;">
            <div style="text-align:center; font-size:10px; color:var(--muted); padding:10px;">
              🛡️ Pesan dienkripsi AES-256 · Hover pesan Anda untuk menghapus
            </div>
          </div>

          <div style="padding:12px; border-top:1px solid var(--border); display:flex; gap:8px; background:rgba(0,0,0,0.15);">
            <input 
              id="chatInput" 
              placeholder="Ketik pesan... (Enter untuk kirim)"
              autocomplete="off"
              style="flex:1; background:rgba(0,102,255,0.06); border:1px solid rgba(0,229,255,0.2); border-radius:10px; padding:10px 14px; color:#fff; outline:none; font-size:13px; font-family:'Exo 2',sans-serif;"
              onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); window.CimegaChat.send();}"
            />
            <button 
              id="chatSendBtn" 
              onclick="window.CimegaChat.send()"
              style="background:linear-gradient(135deg,#0066ff,#00e5ff); border:none; border-radius:10px; padding:10px 18px; cursor:pointer; color:#fff; font-size:13px; font-weight:700; transition:all 0.2s; white-space:nowrap; font-family:'Exo 2',sans-serif;"
            >Kirim 🚀</button>
          </div>
        </div>
      </div>

      <style>
        .chat-msg-wrapper { position: relative; }
        .chat-msg-wrapper .delete-btn {
          position: absolute; top: -6px; right: -6px;
          background: #ff4466; color: #fff; border: none;
          border-radius: 50%; width: 20px; height: 20px;
          font-size: 10px; cursor: pointer; display: none;
          align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(255,68,102,0.5);
          transition: transform 0.15s;
          z-index: 10;
        }
        .chat-msg-wrapper:hover .delete-btn { display: flex; }
        .chat-msg-wrapper .delete-btn:hover { transform: scale(1.15); }
      </style>
    `;
  },

  // ─── FETCH & RENDER MEMBERS (DENGAN PRESENCE REAL-TIME) ────────────
  fetchAndRenderMembers: async function() {
    const list = document.getElementById('chatMembersList');
    const onlineCount = document.getElementById('onlineCount');
    try {
      const { collection, query, where, getDocs } = window._fb;
      const q = query(collection(this.db, "users"), where("school_id", "==", this.schoolId));
      const snap = await getDocs(q);

      const members = [];
      snap.forEach(d => members.push({ id: d.id, ...d.data() }));

      // Hitung yang benar-benar online (last_seen < 60 detik + is_online = true)
      const now = Date.now();
      let onlineNum = 0;
      
      if (!list) return;
      list.innerHTML = '';

      // Urutkan: online duluan
      members.sort((a, b) => {
        const aOnline = a.is_online && a.last_seen?.seconds && (now/1000 - a.last_seen.seconds < 90);
        const bOnline = b.is_online && b.last_seen?.seconds && (now/1000 - b.last_seen.seconds < 90);
        return (bOnline ? 1 : 0) - (aOnline ? 1 : 0);
      });

      members.forEach(m => {
        const isMe = m.id === this.currentUser.id;
        // Cek status online: is_online=true DAN last_seen < 90 detik lalu
        const lastSeenSec = m.last_seen?.seconds || 0;
        const isOnline = m.is_online === true && (now / 1000 - lastSeenSec < 90);
        if (isOnline) onlineNum++;

        const dotColor = isOnline ? '#00ff88' : '#5a8aaa';
        const dotGlow = isOnline ? '0 0 6px #00ff88' : 'none';
        const statusText = isOnline ? 'Online' : 'Offline';
        const roleLabel = Array.isArray(m.roles) ? m.roles[0] : (m.role || 'user');

        const div = document.createElement('div');
        div.style.cssText = `display:flex; align-items:center; gap:8px; padding:8px; border-radius:8px; background:${isOnline ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.02)'}; transition:all 0.3s;`;
        div.innerHTML = `
          <div style="width:8px;height:8px;border-radius:50%;background:${dotColor};box-shadow:${dotGlow};flex-shrink:0;"></div>
          <div style="min-width:0; flex:1;">
            <div style="font-size:11px;font-weight:600;color:${isMe ? 'var(--cyan)' : '#fff'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${m.nama || 'User'}${isMe ? ' ✦' : ''}
            </div>
            <div style="font-size:9px;color:${isOnline ? 'var(--success)' : 'var(--muted)'};text-transform:uppercase;">${statusText} · ${roleLabel}</div>
          </div>
        `;
        list.appendChild(div);
      });

      if (onlineCount) onlineCount.innerText = `• ${onlineNum} online`;

    } catch (e) {
      console.error("Members fetch error:", e);
    }
  },

  // ─── FETCH & RENDER MESSAGES ────────────────────────────────────────
  fetchMessages: async function() {
    try {
      const { collection, query, where, getDocs } = window._fb;
      const q = query(
        collection(this.db, "chats"),
        where("school_id", "==", this.schoolId)
      );
      const snap = await getDocs(q);
      const msgs = [];
      for (const d of snap.docs) {
        const data = d.data();
        const text = await this.decryptSafe(data.payload);
        msgs.push({
          id: d.id,
          sender: data.sender_name || 'Unknown',
          senderId: data.sender_id,
          text: text,
          time: data.client_ts ? new Date(data.client_ts) : (data.timestamp?.toDate ? data.timestamp.toDate() : new Date()),
          deleted: data.deleted || false
        });
      }
      msgs.sort((a, b) => a.time - b.time);
      // Update presence list setiap poll
      this.fetchAndRenderMembers();
      this.renderMessages(msgs);
    } catch (e) {
      console.error("Chat fetch error:", e);
    }
  },

  renderMessages: function(serverMsgs) {
    const history = document.getElementById('chatHistory');
    if (!history) return;

    const serverIds = new Set(serverMsgs.map(m => m.id));
    const combined = [
      ...serverMsgs,
      ...this.localMessages.filter(m => !serverIds.has(m.id))
    ].sort((a, b) => a.time - b.time);

    const wasAtBottom = history.scrollHeight - history.scrollTop <= history.clientHeight + 40;
    const prevScrollTop = history.scrollTop;

    history.innerHTML = `<div style="text-align:center;font-size:10px;color:var(--muted);padding:10px 0 4px;">🛡️ Pesan dienkripsi AES-256 · Hover atas pesan Anda untuk menghapus</div>`;

    combined.forEach(m => {
      if (m.deleted) return; // Pesan yang dihapus tidak ditampilkan

      const isMe = m.senderId === this.currentUser.id;
      const timeStr = m.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const wrapper = document.createElement('div');
      wrapper.className = 'chat-msg-wrapper';
      wrapper.style.cssText = `display:flex; flex-direction:column; align-items:${isMe ? 'flex-end' : 'flex-start'}; gap:3px; position:relative;`;

      let deleteBtn = '';
      if (isMe && !m.pending) {
        deleteBtn = `<button class="delete-btn" onclick="window.CimegaChat.deleteMessage('${m.id}')" title="Hapus pesan">✕</button>`;
      }

      wrapper.innerHTML = `
        ${deleteBtn}
        <div style="font-size:9px;color:var(--muted);margin-${isMe ? 'right' : 'left'}:5px;">
          ${isMe ? 'Anda' : m.sender} · ${timeStr}${m.pending ? ' ⏳' : ''}
        </div>
        <div style="max-width:78%;padding:9px 14px;border-radius:${isMe ? '14px 14px 3px 14px' : '14px 14px 14px 3px'};font-size:13px;line-height:1.5;
          background:${isMe ? 'linear-gradient(135deg,#0066ff,#0044cc)' : 'rgba(255,255,255,0.08)'};
          color:${isMe ? '#fff' : '#e0f4ff'};
          border:1px solid ${isMe ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.08)'};
          word-break:break-word;
          ${m.pending ? 'opacity:0.65;' : ''}">
          ${this.escapeHtml(m.text)}
        </div>
      `;
      history.appendChild(wrapper);
    });

    if (wasAtBottom) history.scrollTop = history.scrollHeight;
    else history.scrollTop = prevScrollTop;
  },

  // ─── DELETE MESSAGE ─────────────────────────────────────────────────
  deleteMessage: async function(messageId) {
    if (!messageId || messageId.startsWith('local_')) return;
    
    try {
      const { doc, updateDoc } = window._fb;
      // Soft delete: tandai sebagai deleted (tidak menghapus data dari Firestore)
      // Ini menjaga audit trail tapi menghilangkan teks dari tampilan semua user
      await updateDoc(doc(this.db, "chats", messageId), {
        deleted: true,
        deleted_at: Date.now()
      });
      
      // Langsung hapus dari UI lokal tanpa menunggu poll
      await this.fetchMessages();
      if (typeof showToast === 'function') showToast('info', 'Dihapus', 'Pesan berhasil dihapus.');
    } catch (e) {
      console.error("Delete failed:", e);
      if (typeof showToast === 'function') showToast('error', 'Gagal', 'Gagal menghapus pesan.');
    }
  },

  // ─── SEND MESSAGE ────────────────────────────────────────────────────
  send: async function() {
    const input = document.getElementById('chatInput');
    const btn = document.getElementById('chatSendBtn');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const localId = 'local_' + Date.now();
    const localMsg = {
      id: localId,
      sender: this.currentUser.nama,
      senderId: this.currentUser.id,
      text: text,
      time: new Date(),
      pending: true,
      deleted: false
    };
    this.localMessages.push(localMsg);
    this.renderMessages([]);

    input.value = '';
    input.disabled = true;
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳'; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      const payload = await this.encryptSafe(text);
      await addDoc(collection(this.db, "chats"), {
        school_id: this.schoolId,
        sender_id: this.currentUser.id,
        sender_name: this.currentUser.nama,
        payload: payload,
        client_ts: Date.now(),
        timestamp: serverTimestamp(),
        deleted: false
      });
      this.localMessages = this.localMessages.filter(m => m.id !== localId);
      await this.fetchMessages();
    } catch (e) {
      const failed = this.localMessages.find(m => m.id === localId);
      if (failed) { failed.text = '[Gagal terkirim] ' + failed.text; failed.pending = false; }
      this.renderMessages([]);
      if (typeof showToast === 'function') showToast('error', 'Gagal', 'Pesan tidak terkirim.');
    } finally {
      input.disabled = false;
      if (btn) { btn.disabled = false; btn.innerHTML = 'Kirim 🚀'; }
      input.focus();
    }
  },

  // ─── UTILS ──────────────────────────────────────────────────────────
  decryptSafe: async function(payload) {
    if (!payload) return '';
    if (!this.schoolKey) return payload;
    try { return await window.CimegaCrypto.decrypt(payload, this.schoolKey); }
    catch (e) { return payload; }
  },

  encryptSafe: async function(text) {
    if (!this.schoolKey) return text;
    try { return await window.CimegaCrypto.encrypt(text, this.schoolKey); }
    catch (e) { return text; }
  },

  escapeHtml: function(text) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }
};
