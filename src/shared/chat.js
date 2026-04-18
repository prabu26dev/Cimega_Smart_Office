window.CimegaChat = {
  db: null,
  sekolah: null,
  schoolKey: null,
  currentUser: null,
  presenceInterval: null,
  unsubMessages: null,
  unsubMembers: null,
  clearedAt: 0,

  // ── 1. STATE & CONTEXT ──
  currentTab: 'school', // 'school' | 'kepsek' (Konteks pembukaan dari Sidebar)
  currentMode: 'group',  // 'group'  | 'private'
  targetId: null,       // User ID untuk Chat Privat
  targetName: null,     // Nama User untuk Judul Header

  init: async function (dbInstance, containerId, options = {}) {
    this.db = dbInstance || window.db || (window._fb ? window._fb.db : null);
    const rawUser = localStorage.getItem('cimega_user');
    this.currentUser = rawUser ? JSON.parse(rawUser) : (window._userData || {});
    this.sekolah = this.currentUser.sekolah || this.currentUser.school_id;

    // ★ PRIMARY CONTEXT ★
    if (options.tab) this.currentTab = options.tab;
    this.currentMode = 'group'; // Reset ke grup setiap kali berganti menu sidebar
    this.targetId = null;

    // Normalisasi Roles
    if (!this.currentUser.roles) {
      const r = this.currentUser.role || 'guru';
      this.currentUser.roles = [r.toLowerCase().trim().replace(/[\s-]/g, '_')];
    }

    const clearKey = `cimega_chat_clear_${this.currentUser.id}_${this.sekolah}`;
    this.clearedAt = parseInt(localStorage.getItem(clearKey) || '0');

    this.injectUI(containerId);

    // Initial listener setup
    if (this.db) {
      if (this.presenceInterval) clearInterval(this.presenceInterval);
      this.setPresence(true);
      this.startMembersListener();
      this.startMessagesListener();
      this.presenceInterval = setInterval(() => this.setPresence(true), 30000);
    }

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

    window.addEventListener('mousedown', this._handleOutsideClick.bind(this));
  },

  injectUI: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // DINAMIS Berdasarkan Konteks
    const sidebarTitle = this.currentTab === 'kepsek' ? 'KOLEGA KEPALA SEKOLAH' : 'USER AKTIF';
    const sidebarIcon = this.currentTab === 'kepsek' ? '🏛️' : '🌍';

    container.innerHTML = `
      <div id="cimegaChatWrapper" style="display:flex; height:calc(100vh - 150px); background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden; font-family:'Exo 2', sans-serif;">
        <!-- SIDEBAR -->
        <div style="width:260px; border-right:1px solid var(--border); background:rgba(0,0,0,0.25); display:flex; flex-direction:column; flex-shrink:0;">
          
          <div style="padding:15px; border-bottom:1px solid var(--border); background:rgba(0,0,0,0.3); display:flex; justify-content:space-between; align-items:center;">
             <div id="sidebarTitle" style="font-family:'Orbitron'; font-size:10px; color:var(--cyan); letter-spacing:1px; white-space:nowrap;">${sidebarIcon} ${sidebarTitle}</div>
             <div id="onlineCount" style="font-size:9px; color:#ffcc00; font-family:'Orbitron';">• 0</div>
          </div>

          <div id="chatMembersList" style="flex:1; overflow-y:auto; padding:8px; display:flex; flex-direction:column; gap:5px;"></div>
        </div>

        <!-- MAIN PANEL -->
        <div style="flex:1; display:flex; flex-direction:column; min-width:0; position:relative; background:rgba(10, 20, 30, 0.98);">
          <div style="padding:12px 20px; background:rgba(4, 25, 50, 0.98); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div id="chatContextIcon" style="font-size:24px;"></div>
              <div>
                <div id="chatHeaderTitle" style="font-family:'Orbitron'; font-size:13px; color:#fff; font-weight:700; text-transform:uppercase;">...</div>
                <div id="chatHeaderSub" style="font-size:10px; color:var(--cyan); opacity:0.8;">Saluran Institusi Terenkripsi</div>
              </div>
            </div>
            <div style="display:flex; gap:8px;">
               <button onclick="window.CimegaChat.clearChat()" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--muted); padding:6px 12px; border-radius:6px; font-size:10px; cursor:pointer;">BERSIHKAN</button>
            </div>
          </div>
          
          <div id="chatHistory" style="flex:1; overflow-y:auto !important; padding:20px; display:flex; flex-direction:column; gap:4px; scroll-behavior:smooth;">
             <div class="spinner-sm" style="margin-top:50px"></div>
          </div>

          <div style="padding:15px; background:rgba(4, 25, 50, 0.98); border-top:1px solid var(--border); position:relative;">
            <div id="emojiPickerCont" style="position:absolute; bottom:80px; left:15px; width:350px; height:400px; display:none; z-index:100; box-shadow:0 10px 50px #000; border-radius:12px; overflow:hidden;">
               <emoji-picker class="cyber-picker" style="width:100%; height:100%;"></emoji-picker>
            </div>

            <div style="display:flex; gap:12px; align-items:center;">
              <button onclick="window.CimegaChat.toggleEmoji()" style="background:none; border:none; font-size:24px; cursor:pointer; opacity:0.8; transition:opacity 0.2s;" title="Emoji">😊</button>
              
              <button onclick="document.getElementById('hiddenChatFiles').click()" style="background:rgba(0,229,255,0.1); border:1.5px solid var(--cyan); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; color:var(--cyan); font-size:18px; cursor:pointer;" title="Kirim File/Gambar">+</button>
              <input type="file" id="hiddenChatFiles" multiple style="display:none" onchange="window.CimegaChat.handleFileUpload(event)" />

              <input id="commChatInput" placeholder="Ketik pesan di sini..." maxlength="1000" style="flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(0,229,255,0.2); border-radius:12px; padding:12px 18px; color:#fff; outline:none; font-size:14px;" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); window.CimegaChat.send();}" />
              
              <button onclick="window.CimegaChat.send()" style="background:linear-gradient(135deg,#aa55ff, #00e5ff); border:none; border-radius:12px; width:50px; height:46px; cursor:pointer; color:#fff; font-size:18px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px rgba(0,229,255,0.2);">🚀</button>
            </div>

            <div id="chatUploadProgress" style="display:none; position:absolute; bottom:70px; left:15px; right:15px; background:rgba(0,0,0,0.9); border:1px solid var(--cyan); border-radius:10px; padding:12px; backdrop-filter:blur(10px);">
               <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                 <div style="font-size:11px; color:var(--cyan); font-weight:700;" id="chatUploadStatus">Processing...</div>
                 <div style="font-size:10px; color:var(--muted);" id="chatUploadPercent">0%</div>
               </div>
               <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                 <div id="chatUploadProgressInner" style="height:100%; width:0%; background:var(--cyan); transition:width 0.3s; box-shadow:0 0 10px var(--cyan);"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        .cyber-picker {
          --background: #041428;
          --border-color: rgba(0, 229, 255, 0.2);
          --indicator-color: #00e5ff;
          --button-hover-background: rgba(0, 229, 255, 0.1);
        }
        #chatHistory::-webkit-scrollbar { width: 6px; }
        #chatHistory::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 10px; }
        .chat-date-divider { clear: both; display:flex; align-items:center; justify-content:center; margin: 20px 0; width: 100%; }
        .chat-date-label { padding: 4px 15px; background:rgba(255,255,255,0.05); border-radius:10px; font-size:10px; color:#aaa; font-weight:700; border:1px solid rgba(255,255,255,0.03); }
        .chat-img-msg { transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.1); }
        .chat-img-msg:hover { transform: scale(1.02); }
        .spinner-sm { width:24px; height:24px; border:3px solid rgba(0,229,255,0.1); border-top-color:var(--cyan); border-radius:50%; animation:spinChat 0.8s linear infinite; margin:0 auto; }
        @keyframes spinChat { to { transform: rotate(360deg); } }
      </style>
    `;
    this.updateHeader();
  },

  updateHeader: function () {
    const hIcon = document.getElementById('chatContextIcon');
    const hTitle = document.getElementById('chatHeaderTitle');
    const hSub = document.getElementById('chatHeaderSub');
    if (!hTitle) return;

    if (this.currentMode === 'private') {
      hIcon.innerText = '👤';
      hTitle.innerText = `RAHASIA: ${this.targetName || 'Personil'}`;
      hSub.innerText = 'Percakapan 1-ke-1 Terikat Institusi';
    } else if (this.currentTab === 'kepsek') {
      hIcon.innerText = '🏛️';
      hTitle.innerText = 'GRUP FORUM KEPALA SEKOLAH';
      hSub.innerText = 'Diskusi Strategis Pimpinan';
    } else {
      hIcon.innerText = '🌍';
      hTitle.innerText = 'CHAT KOMUNITAS SEKOLAH';
      hSub.innerText = 'Komunikasi Institusi Terenkripsi';
    }
  },

  switchPrivate: function (id, name) {
    // Chat pribadi hanya bisa dipicu di mode Kepsek
    if (this.currentTab !== 'kepsek') return;
    if (this.currentMode === 'private' && this.targetId === id) return;

    this.currentMode = 'private';
    this.targetId = id;
    this.targetName = name;

    this.updateHeader();
    this.startMessagesListener();
    this.renderMembersList(this._lastMembers || []); // Update UI highlight
  },

  handleFileUpload: async function (e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // ATURAN BARU: Maksimal 10 gambar sekaligus
    if (files.length > 10) {
      if (window.showToast) window.showToast('warn', 'Batas Terlampaui', 'Maksimal 10 gambar yang dapat dikirim sekaligus.');
      else alert('Maksimal 10 gambar yang dapat dikirim sekaligus.');
      e.target.value = '';
      return;
    }

    const isKepsek = this.currentUser.roles.includes('kepsek');
    const maxSize = 10 * 1024 * 1024; // 10MB

    const p = document.getElementById('chatUploadProgress');
    const pi = document.getElementById('chatUploadProgressInner');
    const st = document.getElementById('chatUploadStatus');
    const pct = document.getElementById('chatUploadPercent');

    p.style.display = 'block';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // ── ATURAN BARU: HANYA GAMBAR (JPG/PNG) & BERLAKU UNTUK SEMUA USER (TERMASUK KEPSEK) ──
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        if (window.showToast) window.showToast('error', 'Format Ditolak', `File "${file.name}" ditolak. Chat sekolah hanya mendukung format JPG dan PNG.`);
        else alert(`File "${file.name}" ditolak. Chat hanya mendukung format JPG/PNG.`);
        continue;
      }

      if (file.size > maxSize) {
        if (window.showToast) window.showToast('warn', 'Batas Ukuran', `File "${file.name}" melebihi batas 10MB.`);
        else alert(`File "${file.name}" melebihi batas 10MB.`);
        continue;
      }

      st.textContent = `Mengunggah: ${file.name}`;
      try {
        const ext = file.name.split('.').pop();
        const path = `chat_media/${this.sekolah}/${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${ext}`;

        await window._supabase.storage.from('cimega-cloud').upload(path, file);
        const { data } = window._supabase.storage.from('cimega-cloud').getPublicUrl(path);

        const metadata = {
          name: file.name,
          size: (file.size / (1024 * 1024) > 1) ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          url: data.publicUrl
        };

        await this.send(JSON.stringify(metadata), true);

        const progress = ((i + 1) / files.length) * 100;
        pi.style.width = progress + '%';
        pct.textContent = Math.round(progress) + '%';
      } catch (err) { console.error('Upload Error:', err); }
    }

    setTimeout(() => { p.style.display = 'none'; e.target.value = ''; }, 800);
  },

  startMembersListener: function () {
    if (this.unsubMembers) this.unsubMembers();
    const { collection, query, where, onSnapshot } = window._fb;

    // ★ SCHOOL ISOLATION GUARD ★
    let q = query(collection(this.db, "users"), where("sekolah", "==", this.sekolah));

    this.unsubMembers = onSnapshot(q, (snap) => {
      let members = [];
      snap.forEach(d => {
        const data = d.data();
        const roles = data.roles || [data.role?.toLowerCase() || 'guru'];

        // Mode Filter
        if (this.currentTab === 'kepsek') {
          // Hanya tampilkan Kepsek lain
          if (roles.includes('kepsek') && d.id !== this.currentUser.id) {
            members.push({ id: d.id, ...data });
          }
        } else {
          // Tampilkan semua di grup sekolah
          members.push({ id: d.id, ...data });
        }
      });
      this._lastMembers = members;
      this.renderMembersList(members);
    });
  },

  startMessagesListener: function () {
    if (this.unsubMessages) this.unsubMessages();
    const { collection, query, where, onSnapshot } = window._fb;

    let q;
    // ★ MULTI-SCHOOL ISOLATION GUARD ★
    if (this.currentMode === 'private') {
      const sortedIds = [this.currentUser.id, this.targetId].sort();
      const privateID = `${this.sekolah}_${sortedIds.join('_')}`;
      q = query(collection(this.db, "chats"),
        where("sekolah", "==", this.sekolah),
        where("private_id", "==", privateID)
      );
    } else {
      const scope = this.currentTab === 'kepsek' ? 'kepsek' : 'school';
      q = query(collection(this.db, "chats"),
        where("sekolah", "==", this.sekolah),
        where("scope", "==", scope)
      );
    }

    this.unsubMessages = onSnapshot(q, async (snap) => {
      const msgs = [];
      for (const d of snap.docs) {
        const data = d.data();
        try {
          const decrypted = await this.decryptSafe(data.payload);
          msgs.push({
            id: d.id,
            sender: data.sender_name,
            senderId: data.sender_id,
            text: decrypted,
            time: data.client_ts ? new Date(data.client_ts) : new Date(),
            deleted: data.deleted || false
          });
        } catch (e) { msgs.push({ id: d.id, sender: data.sender_name, text: "[Terenkripsi]", time: new Date() }); }
      }
      msgs.sort((a, b) => a.time - b.time);
      this.renderMessages(msgs);
    });
  },

  renderMembersList: function (members) {
    const cont = document.getElementById('chatMembersList');
    const headerOC = document.getElementById('onlineCount');
    if (!cont) return; cont.innerHTML = '';

    // ★ KEPSEK MODE UI ★
    if (this.currentTab === 'kepsek') {
      const groupBtn = document.createElement('div');
      groupBtn.onclick = () => {
        this.currentMode = 'group';
        this.targetId = null;
        this.updateHeader();
        this.startMessagesListener();
        this.renderMembersList(members);
      };
      groupBtn.style.cssText = `display:flex; align-items:center; gap:10px; padding:12px; border-radius:10px; background:${this.currentMode === 'group' ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.03)'}; cursor:pointer; margin-bottom:12px; border:1px solid ${this.currentMode === 'group' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}; transition:all 0.2s;`;
      groupBtn.innerHTML = `<div style="font-size:20px;">🏛️</div><div><div style="font-size:12px; color:#fff; font-weight:700;">Grup Forum Kepsek</div><div style="font-size:9px; color:var(--muted);">Diskusi Pimpinan</div></div>`;
      cont.appendChild(groupBtn);
    }

    const now = Date.now();
    let onlineCount = 0;

    members.sort((a, b) => (b.is_online ? 1 : 0) - (a.is_online ? 1 : 0)).forEach(m => {
      const isOnline = m.is_online && (now / 1000 - (m.last_seen?.seconds || 0) < 180);
      if (isOnline) onlineCount++;

      const isActive = this.currentMode === 'private' && this.targetId === m.id;
      const div = document.createElement('div');
      div.onclick = () => {
        if (this.currentTab === 'kepsek') this.switchPrivate(m.id, m.nama);
      };
      div.style.cssText = `display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; background:${isActive ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.02)'}; cursor:${this.currentTab === 'kepsek' ? 'pointer' : 'default'}; border:1px solid ${isActive ? 'var(--cyan)' : 'rgba(255,255,255,0.03)'}; transition:all 0.2s; margin-bottom:4px;`;

      const avatar = m.avatarUrl ? `<img src="${m.avatarUrl}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">` : `<div style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:14px;">👤</div>`;

      div.innerHTML = `
         <div style="position:relative;">
           ${avatar}
           <div style="width:9px; height:9px; border-radius:50%; background:${isOnline ? '#ffcc00' : '#555'}; position:absolute; bottom:-1px; right:-1px; border:2px solid #112233;"></div>
         </div>
         <div style="flex:1; min-width:0;">
           <div style="font-size:12px; color:#fff; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.nama}</div>
           <div style="font-size:9px; color:var(--muted);">${m.role || 'Staf'}</div>
         </div>
       `;
      cont.appendChild(div);
    });
    if (headerOC) headerOC.innerText = `• ${onlineCount}`;
  },

  renderMessages: function (messages) {
    const history = document.getElementById('chatHistory');
    if (!history) return;

    const valid = messages.filter(m => m.time.getTime() > this.clearedAt && !m.deleted);
    const wasBottom = history.scrollHeight - history.scrollTop <= history.clientHeight + 200;

    history.innerHTML = '';
    let lastDate = '';

    valid.forEach(m => {
      if (m.time.toDateString() !== lastDate) {
        history.appendChild(this.createDateDivider(m.time));
        lastDate = m.time.toDateString();
      }

      const isMe = String(m.senderId) === String(this.currentUser.id);
      let content = '';

      // ★ MEDIA/FILE DETECTION ★
      if (m.text.startsWith('{"name":')) {
        try {
          const file = JSON.parse(m.text);
          const isImg = file.type?.startsWith('image/');
          if (isImg) {
            content = `<img src="${file.url}" class="chat-img-msg" style="max-width:280px; border-radius:12px; cursor:pointer;" onclick="window.cimegaAPI.openExternal('${file.url}')">`;
          } else {
            const ext = file.name.split('.').pop().toUpperCase();
            let icon = '📒';
            if (ext === 'PDF') icon = '📕';
            else if (['DOC', 'DOCX'].includes(ext)) icon = '📘';
            else if (['XLS', 'XLSX'].includes(ext)) icon = '📗';

            content = `
              <div onclick="window.cimegaAPI.openExternal('${file.url}')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:12px; display:flex; align-items:center; gap:12px; cursor:pointer; width:220px;">
                <div style="font-size:26px;">${icon}</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:11px; font-weight:700; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${file.name}</div>
                  <div style="font-size:9px; color:var(--cyan);">${file.size} · ${ext}</div>
                </div>
                <div style="font-size:14px; color:var(--muted); margin-left:5px;">📥</div>
              </div>
            `;
          }
        } catch (e) { content = m.text; }
      } else {
        content = `<div style="font-size:13px; color:#fff; line-height:1.6; white-space:pre-wrap; word-break:break-word;">${this.escapeHtml(m.text)}</div>`;
      }

      const wrap = document.createElement('div');
      wrap.style.cssText = `clear:both; margin-bottom:14px; display:flex; flex-direction:column; align-items:${isMe ? 'flex-end' : 'flex-start'};`;

      const bubble = document.createElement('div');
      bubble.style.cssText = `max-width:85%; background:${isMe ? 'linear-gradient(135deg, rgba(80,0,200,0.4), rgba(0,50,150,0.3))' : 'rgba(255,255,255,0.04)'}; padding:10px 14px; border-radius:${isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'}; border:1px solid ${isMe ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)'}; position:relative; box-shadow:0 6px 15px rgba(0,0,0,0.2);`;

      const header = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; gap:20px;">
        <div style="font-size:9px; color:var(--cyan); font-weight:800; opacity:0.8; font-family:'Orbitron'; text-transform:uppercase;">${isMe ? 'ANDA' : m.sender}</div>
        ${isMe ? `<button onclick="window.CimegaChat.deleteMessage('${m.id}')" style="background:none; border:none; color:var(--danger); font-size:10px; cursor:pointer; opacity:0.4; transition:0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.4">✕</button>` : ''}
      </div>`;

      bubble.innerHTML = `${header}${content}<div style="font-size:8px; opacity:0.3; text-align:right; margin-top:6px; color:#fff;">${m.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>`;

      if (typeof twemoji !== 'undefined' && !m.text.includes('{"name":')) twemoji.parse(bubble);

      wrap.appendChild(bubble);
      history.appendChild(wrap);
    });

    if (wasBottom) history.scrollTop = history.scrollHeight;
  },

  createDateDivider: function (date) {
    const d = document.createElement('div'); d.className = 'chat-date-divider';
    d.innerHTML = `<div class="chat-date-label">${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>`; return d;
  },

  send: async function (customText = null, isRaw = false) {
    const input = document.getElementById('commChatInput');
    const text = customText || input?.value.trim();
    if (!text) return;
    if (!customText && input) input.value = '';

    const { collection, addDoc, serverTimestamp } = window._fb;
    const payload = await this.encryptSafe(text);

    const docData = {
      sekolah: this.sekolah, // MANDATORY FOR ISOLATION
      sender_id: this.currentUser.id,
      sender_name: this.currentUser.nama,
      payload: payload,
      client_ts: Date.now(),
      timestamp: serverTimestamp(),
      deleted: false
    };

    if (this.currentMode === 'private') {
      const sortedIds = [this.currentUser.id, this.targetId].sort();
      docData.private_id = `${this.sekolah}_${sortedIds.join('_')}`; // ISOLATED BY SCHOOL
      docData.scope = 'private';
    } else {
      docData.scope = this.currentTab === 'kepsek' ? 'kepsek' : 'school';
    }

    await addDoc(collection(this.db, "chats"), docData);
  },

  clearChat: function () {
    if (!confirm('Bersihkan riwayat chat di perangkat ini?')) return;
    this.clearedAt = Date.now();
    const key = `cimega_chat_clear_${this.currentUser.id}_${this.sekolah}`;
    localStorage.setItem(key, this.clearedAt);
    this.renderMessages([]);
  },

  setPresence: async function (on) {
    if (this.db && this.currentUser.id) {
      await window._fb.updateDoc(window._fb.doc(this.db, "users", this.currentUser.id), {
        is_online: on,
        last_seen: window._fb.serverTimestamp()
      });
    }
  },

  deleteMessage: async function (id) {
    if (!confirm('Hapus pesan ini selamanya?')) return;
    try {
      await window._fb.updateDoc(window._fb.doc(this.db, "chats", id), { deleted: true });
    } catch (e) { alert('Gagal menghapus pesan.'); }
  },

  decryptSafe: async function (p) { try { return p ? await window.CimegaCrypto.decrypt(p, this.schoolKey) : ''; } catch (e) { return p; } },
  encryptSafe: async function (t) { try { return t ? await window.CimegaCrypto.encrypt(t, this.schoolKey) : t; } catch (e) { return t; } },
  escapeHtml: function (t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; },
  toggleEmoji: function () { const el = document.getElementById('emojiPickerCont'); if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block'; },
  _handleOutsideClick: function (e) { const ep = document.getElementById('emojiPickerCont'); if (ep && ep.style.display === 'block' && !ep.contains(e.target) && !e.target.closest('button')) ep.style.display = 'none'; }
};
