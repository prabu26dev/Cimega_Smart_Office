/**
 * Cimega Smart Office - Communication Master (Online Picker Edition)
 * Using emoji-picker-element for high-performance, searchable, and always-up-to-date emojis.
 */

window.CimegaChat = {
  db: null,
  sekolah: null,
  schoolKey: null,
  currentUser: null,
  presenceInterval: null,
  unsubMessages: null,
  unsubMembers: null,
  clearedAt: 0,

  init: async function(dbInstance, containerId) {
    this.db = dbInstance || window.db || (window._fb ? window._fb.db : null);
    const rawUser = localStorage.getItem('cimega_user');
    this.currentUser = rawUser ? JSON.parse(rawUser) : (window._userData || {});
    this.sekolah = this.currentUser.sekolah || this.currentUser.school_id;
    const clearKey = `cimega_chat_clear_${this.currentUser.id}_${this.sekolah}`;
    this.clearedAt = parseInt(localStorage.getItem(clearKey) || '0');
    
    this.injectUI(containerId);

    // Wait for the custom element to be defined before attaching event
    const attachPicker = () => {
      const picker = document.querySelector('emoji-picker');
      if (picker) {
        picker.addEventListener('emoji-click', event => {
          this.insertEmoji(event.detail.unicode);
        });
      }
    };

    if (customElements && customElements.whenDefined) {
      customElements.whenDefined('emoji-picker').then(attachPicker).catch(attachPicker);
    } else {
      setTimeout(attachPicker, 1000);
    }

    if (this.db) {
      this.setPresence(true);
      this.startMembersListener();
      this.startMessagesListener();
      this.presenceInterval = setInterval(() => this.setPresence(true), 30000);
    }
    window.addEventListener('mousedown', this._handleOutsideClick.bind(this));
  },

  _handleOutsideClick: function(e) {
    const epCont = document.getElementById('emojiPickerCont');
    if (epCont && !epCont.contains(e.target) && !e.target.closest('button')) epCont.style.display = 'none';
  },

  injectUI: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div id="cimegaChatWrapper" style="display:flex; height:calc(100vh - 150px); background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden;">
        <!-- SIDEBAR -->
        <div style="width:240px; border-right:1px solid var(--border); background:rgba(0,0,0,0.25); display:flex; flex-direction:column; flex-shrink:0;">
          <div style="padding:15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
             <div style="font-family:'Orbitron'; font-size:10px; color:var(--cyan); letter-spacing:1px;">👤 PERSONIL</div>
             <div id="onlineCount" style="font-size:9px; color:#ffcc00; font-family:'Orbitron';">• 0 online</div>
          </div>
          <div id="chatMembersList" style="flex:1; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:5px;">
            <div class="spinner-sm" style="margin-top:20px"></div>
          </div>
        </div>

        <!-- MAIN PANEL -->
        <div style="flex:1; display:flex; flex-direction:column; min-width:0; position:relative; background:rgba(10, 20, 30, 0.98);">
          <div style="padding:12px 20px; background:rgba(4, 25, 50, 0.98); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-family:'Orbitron'; font-size:13px; color:#fff; font-weight:700;">KOMUNIKASI INTERNAL 🔒</div>
              <div style="font-size:10px; color:var(--cyan); opacity:0.8;">Saluran Institusi Aman & Terenkripsi</div>
            </div>
            <button onclick="window.CimegaChat.clearChat()" style="background:rgba(255,68,102,0.1); border:1px solid rgba(255,68,102,0.3); color:#ff4466; padding:5px 12px; border-radius:6px; font-size:10px; cursor:pointer; font-weight:700;">BERSIHKAN CHAT</button>
          </div>
          
          <div id="chatHistory" style="flex:1; overflow-y:auto !important; padding:20px; display:block !important;"></div>

          <div style="padding:15px; background:rgba(4, 25, 50, 0.98); border-top:1px solid var(--border); position:relative;">
            
            <div id="emojiPickerCont" style="position:absolute; bottom:80px; left:15px; width:350px; height:400px; display:none; z-index:100; box-shadow:0 10px 50px #000;">
               <emoji-picker class="cyber-picker" data-source="https://cdn.jsdelivr.net/npm/emojibase-data@15/en/data.json"></emoji-picker>
            </div>

            <div style="display:flex; gap:12px; align-items:center;">
              <button onclick="window.CimegaChat.toggleEmoji()" style="background:none; border:none; font-size:24px; cursor:pointer;" title="Emoji">😊</button>
              
              <button onclick="document.getElementById('hiddenChatFiles').click()" style="background:rgba(0,229,255,0.1); border:1.5px solid var(--cyan); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:var(--cyan); font-size:18px; cursor:pointer;" title="Maks 10 Gambar">+</button>
              <input type="file" id="hiddenChatFiles" multiple accept="image/*" style="display:none" onchange="window.CimegaChat.handleImageUpload(event)" />

              <input id="chatInput" placeholder="Ketik pesan..." maxlength="1000" autocomplete="off" style="flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(0,229,255,0.2); border-radius:12px; padding:12px 18px; color:#fff; outline:none; font-size:14px;" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); window.CimegaChat.send();}" />
              <button onclick="window.CimegaChat.send()" style="background:linear-gradient(135deg,#0066ff,#00e5ff); border:none; border-radius:50%; width:45px; height:45px; cursor:pointer; color:#fff;">🚀</button>
            </div>

            <div id="chatUploadProgress" style="display:none; position:absolute; bottom:65px; left:15px; right:15px; background:#000; border:1px solid var(--cyan); border-radius:8px; padding:10px;">
               <div style="font-size:10px; color:var(--cyan); margin-bottom:5px;" id="chatUploadStatus">Mengunggah...</div>
               <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                 <div id="chatUploadProgressInner" style="height:100%; width:0%; background:var(--cyan); transition:width 0.3s;"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        .cyber-picker {
          width: 100%;
          height: 100%;
          --background: #041428;
          --border-color: rgba(0, 229, 255, 0.2);
          --indicator-color: #00e5ff;
          --button-hover-background: rgba(0, 229, 255, 0.1);
          --outline-color: #00e5ff;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .chat-date-divider { clear: both; display:flex; align-items:center; justify-content:center; margin: 20px 0; width: 100%; }
        .chat-date-label { padding: 4px 15px; background:rgba(255,255,255,0.05); border-radius:10px; font-size:10px; color:#aaa; font-weight:700; border:1px solid rgba(255,255,255,0.03); }
        img.emoji { height: 1.25em; width: 1.25em; vertical-align: -0.1em; }
        .spinner-sm { width:20px; height:20px; border:2px solid rgba(0,229,255,0.1); border-top-color:var(--cyan); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto; }
        .chat-img-msg { max-width: 100%; border-radius: 8px; margin-top: 5px; cursor: pointer; transition: opacity 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;
  },

  renderEmojis: function() { console.log('[Chat] Online Picker Active'); },

  insertEmoji: function(unicode) {
    const i = document.getElementById('chatInput');
    if (i && i.value.length < 1000) { i.value += unicode; i.focus(); }
  },

  toggleEmoji: function() {
    const el = document.getElementById('emojiPickerCont');
    if(el) el.style.display = el.style.display === 'flex' ? 'none' : 'flex';
  },

  handleImageUpload: async function(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (files.length > 10) { alert('Maksimal 10 gambar.'); e.target.value = ''; return; }
    const p = document.getElementById('chatUploadProgress');
    const pi = document.getElementById('chatUploadProgressInner');
    const st = document.getElementById('chatUploadStatus');
    p.style.display = 'block'; pi.style.width = '0%';
    for (let i = 0; i < files.length; i++) {
        st.textContent = `Mengunggah (${i+1}/${files.length}): ${files[i].name}`;
        try {
            const path = `chat_media/${this.sekolah}/${Date.now()}_${files[i].name.replace(/\s+/g, '_')}`;
            await window._supabase.storage.from('cimega-cloud').upload(path, files[i]);
            const { data } = window._supabase.storage.from('cimega-cloud').getPublicUrl(path);
            await this.sendMedia(data.publicUrl);
            pi.style.width = ((i+1)/files.length)*100 + '%';
        } catch (err) { console.error(err); }
    }
    setTimeout(() => { p.style.display = 'none'; e.target.value = ''; }, 1000);
  },

  sendMedia: async function(url) {
    const { collection, addDoc, serverTimestamp } = window._fb;
    const payload = await this.encryptSafe(url);
    await addDoc(collection(this.db, "chats"), { sekolah: this.sekolah, sender_id: this.currentUser.id, sender_name: this.currentUser.nama, payload, client_ts: Date.now(), timestamp: serverTimestamp(), deleted: false });
  },

  startMembersListener: function() {
    const { collection, query, where, onSnapshot } = window._fb;
    const q = query(collection(this.db, "users"), where("sekolah", "==", this.sekolah));
    this.unsubMembers = onSnapshot(q, (snap) => {
      const all = []; snap.forEach(d => all.push({ id: d.id, ...d.data() })); this.renderMembersList(all);
    });
  },

  startMessagesListener: function() {
    const { collection, query, where, onSnapshot } = window._fb;
    const q = query(collection(this.db, "chats"), where("sekolah", "==", this.sekolah));
    this.unsubMessages = onSnapshot(q, async (snap) => {
      const msgs = [];
      for (const d of snap.docs) {
        const data = d.data();
        const text = await this.decryptSafe(data.payload);
        msgs.push({ id: d.id, sender: data.sender_name, senderId: data.sender_id, text, time: data.client_ts ? new Date(data.client_ts) : new Date(), deleted: data.deleted || false });
      }
      msgs.sort((a,b) => a.time - b.time); this.renderMessages(msgs);
    });
  },

  renderMembersList: function(members) {
    const cont = document.getElementById('chatMembersList');
    const headerOC = document.getElementById('onlineCount');
    if (!cont) return; cont.innerHTML = '';
    const now = Date.now(); let count = 0;
    members.sort((a,b) => (b.is_online?1:0)-(a.is_online?1:0)).forEach(m => {
       const online = m.is_online && (now/1000 - (m.last_seen?.seconds||0) < 150); if (online) count++;
       const div = document.createElement('div');
       div.style.cssText = `display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; background:rgba(255,255,255,0.03); margin-top:4px;`;
       div.innerHTML = `<div style="width:7px; height:7px; border-radius:50%; background:${online?'#ffcc00':'#666'};"></div><div style="font-size:12px; color:#fff;">${m.nama}</div>`;
       cont.appendChild(div);
    });
    if (headerOC) headerOC.innerText = `• ${count} online`;
  },

  renderMessages: function(messages) {
    const history = document.getElementById('chatHistory');
    if (!history) return;
    const valid = messages.filter(m => m.time.getTime() > this.clearedAt && !m.deleted);
    const wasBottom = history.scrollHeight - history.scrollTop <= history.clientHeight + 100;
    history.innerHTML = ''; let lastDate = '';
    valid.forEach(m => {
      if (m.time.toDateString() !== lastDate) { history.appendChild(this.createDateDivider(m.time)); lastDate = m.time.toDateString(); }
      const isMe = String(m.senderId) === String(this.currentUser.id);
      const isImg = m.text.startsWith('http') && (m.text.match(/\.(jpg|jpeg|png|webp|gif)/i) || m.text.includes('supabase'));
      const content = isImg ? `<img src="${m.text}" class="chat-img-msg" onclick="window.cimegaAPI.openExternal('${m.text}')">` : `<div style="font-size:13px; color:#fff; word-break:break-all;">${this.escapeHtml(m.text)}</div>`;
      const wrap = document.createElement('div');
      wrap.style.cssText = `clear:both; margin-bottom:12px; display:block;`;
      const align = isMe ? 'right' : 'left';
      wrap.innerHTML = `<div style="float:${align}; max-width:75%; background:${isMe?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.3)'}; padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); box-shadow:0 4px 15px rgba(0,0,0,0.2);"><div style="font-size:9px; color:var(--cyan); margin-bottom:4px; font-weight:bold; opacity:0.8;">${isMe?'Anda':m.sender}</div>${content}<div style="font-size:8px; opacity:0.3; text-align:right; margin-top:4px;">${m.time.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div></div>`;
      if (typeof twemoji !== 'undefined' && !m.text.includes('http')) twemoji.parse(wrap);
      history.appendChild(wrap);
    });
    if (wasBottom) history.scrollTop = history.scrollHeight;
  },

  createDateDivider: function(date) {
    const d = document.createElement('div'); d.className = 'chat-date-divider';
    d.innerHTML = `<div class="chat-date-label">${date.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</div>`; return d;
  },

  send: async function() {
    const i = document.getElementById('chatInput'); const t = i?.value.trim();
    if (!t || t.length > 1000) return; i.value = '';
    const { collection, addDoc, serverTimestamp } = window._fb;
    const payload = await this.encryptSafe(t);
    await addDoc(collection(this.db, "chats"), { sekolah: this.sekolah, sender_id: this.currentUser.id, sender_name: this.currentUser.nama, payload, client_ts: Date.now(), timestamp: serverTimestamp(), deleted: false });
  },

  clearChat: function() {
    if (!confirm('Bersihkan chat?')) return;
    this.clearedAt = Date.now(); localStorage.setItem(`cimega_chat_clear_${this.currentUser.id}_${this.sekolah}`, this.clearedAt); this.renderMessages([]);
  },

  setPresence: async function(on) {
    if (this.db && this.currentUser.id) await window._fb.updateDoc(window._fb.doc(this.db, "users", this.currentUser.id), { is_online: on, last_seen: window._fb.serverTimestamp() });
  },

  decryptSafe: async function(p) { try { return p ? await window.CimegaCrypto.decrypt(p, this.schoolKey) : ''; } catch (e) { return p; } },
  encryptSafe: async function(t) { try { return t ? await window.CimegaCrypto.encrypt(t, this.schoolKey) : t; } catch (e) { return t; } },
  escapeHtml: function(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
};
