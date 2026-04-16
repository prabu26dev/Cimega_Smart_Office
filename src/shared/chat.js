/**
 * Cimega Smart Office - Multi-Tenant Chat (v7.0 - Native Emoji & GIF)
 * Features: Built-in Emoji Base (No external fetching), GIF Search, Date Grouping.
 */

window.CimegaChat = {
  db: null,
  sekolah: null,
  schoolKey: null,
  currentUser: null,
  localMessages: [],
  presenceInterval: null,
  unsubMessages: null,
  unsubMembers: null,
  gifApiKey: 'LIVDSRZULEUB',
  clearedAt: 0,
  targetCategory: 'Faces',

  // Built-in Emoji Database (Safe for Offline/No-load)
  emojiData: {
    Faces: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','👻','💀','☠️','👽','👾','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾'],
    People: ['👋','🤚','🖐','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦿','🦶','耳','👂','🦻','鼻','👃','🧠','🦷','🦴','👀','👁','👅','👄','💋','🩸'],
    Hearts: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟'],
    Food: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌽','🥕','🥔','🍠','🥐','🍞','🥖','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🍳','🍲','🥣','🥗','🍿','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯'],
    Travel: ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🏍','🛵','🚲','🛴','🛹','🚍','🚘','🚖','🚆','🚀','✈️','🛸','🚁','🛶','⛵️','🚢','⚓️'],
    Flags: ['🇮🇩','🇮🇲','🇯🇵','🇰🇷','🇩🇪','🇨🇳','🇺🇸','🇫🇷','🇬🇧','🇮🇹','🇷🇺','🇪🇸','🇧🇷','🇲🇽','🇨🇦','🇦🇺','🇮🇳','🌍','🌎','🌏']
  },

  init: async function(dbInstance, containerId) {
    this.db = dbInstance || window.db || (window._fb ? window._fb.db : null);
    const rawUser = localStorage.getItem('cimega_user');
    this.currentUser = rawUser ? JSON.parse(rawUser) : (window._userData || {});
    this.sekolah = this.currentUser.sekolah || this.currentUser.school_id;

    const clearKey = `cimega_chat_clear_${this.currentUser.id}_${this.sekolah}`;
    this.clearedAt = parseInt(localStorage.getItem(clearKey) || '0');

    this.injectUI(containerId);

    try {
      if (this.unsubMessages) this.unsubMessages();
      if (this.unsubMembers) this.unsubMembers();
      if (this.presenceInterval) clearInterval(this.presenceInterval);

      if (this.db) {
        this.setPresence(true);
        this.startMembersListener();
        this.startMessagesListener();
      } else {
        setTimeout(() => this.init(null, containerId), 1500);
        return;
      }

      this.presenceInterval = setInterval(() => this.setPresence(true), 30000);
      window.addEventListener('mousedown', this._handleOutsideClick.bind(this));
    } catch (e) { console.error('[Chat] Init error', e); }
  },

  _handleOutsideClick: function(e) {
    const epCont = document.getElementById('emojiPickerCont');
    const gpCont = document.getElementById('gifPickerCont');
    if (epCont && !epCont.contains(e.target) && !e.target.closest('button')) epCont.style.display = 'none';
    if (gpCont && !gpCont.contains(e.target) && !e.target.closest('button')) gpCont.style.display = 'none';
  },

  injectUI: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="cimegaChatWrapper" style="display:flex; height:calc(100vh - 150px); background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden; position:relative;">
        <!-- LIST MEMBERS -->
        <div style="width:240px; border-right:1px solid var(--border); background:rgba(0,0,0,0.2); display:flex; flex-direction:column; flex-shrink:0;">
          <div style="padding:15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
             <div style="font-family:'Orbitron'; font-size:10px; color:var(--cyan);">👤 PERSONIL</div>
             <div id="onlineCount" style="font-size:9px; color:#ffcc00; font-family:'Orbitron';">• 0 online</div>
          </div>
          <div id="chatMembersList" style="flex:1; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:5px;">
            <div class="spinner-sm" style="margin-top:20px"></div>
          </div>
        </div>

        <!-- MAIN CHAT PANEL -->
        <div style="flex:1; display:flex; flex-direction:column; min-width:0; position:relative; background:rgba(4, 20, 40, 0.9);">
          
          <div style="padding:12px 20px; background:rgba(4, 25, 50, 0.95); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; z-index:10;">
            <div>
              <div style="font-family:'Orbitron'; font-size:13px; color:#fff; font-weight:700;">CIPER CHAT NATIVE 🔒</div>
              <div style="font-size:10px; color:var(--cyan); opacity:0.8;">${this.sekolah || 'Office'}</div>
            </div>
            <button onclick="window.CimegaChat.clearChat()" style="background:rgba(255,68,102,0.1); border:1px solid rgba(255,68,102,0.3); color:#ff4466; padding:5px 12px; border-radius:6px; font-size:10px; cursor:pointer; font-weight:700;">HAPUS LAYAR</button>
          </div>
          
          <div id="chatHistory" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px;"></div>

          <!-- INPUT AREA -->
          <div style="padding:15px; background:rgba(4, 25, 50, 0.95); border-top:1px solid var(--border); position:relative;">
            
            <!-- CUSTOM EMOJI PICKER -->
            <div id="emojiPickerCont" style="position:absolute; bottom:80px; left:15px; width:320px; height:400px; background:var(--dark2); border:1px solid var(--border); border-radius:12px; display:none; flex-direction:column; z-index:100; box-shadow:0 10px 40px rgba(0,0,0,0.8);">
               <div style="padding:10px; border-bottom:1px solid var(--border); display:flex; gap:5px; background:rgba(255,255,255,0.03);">
                 <input id="emojiSearchInput" placeholder="Cari emoji..." style="flex:1; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:6px; color:#fff; padding:5px 10px; font-size:12px;" oninput="window.CimegaChat.renderEmojis(this.value)" />
               </div>
               <div id="emojiCategoryTabs" style="display:flex; padding:5px; gap:2px; border-bottom:1px solid var(--border); overflow-x:auto; background:rgba(0,0,0,0.2);">
                 ${Object.keys(this.emojiData).map(cat => `<button onclick="window.CimegaChat.renderEmojis('', '${cat}')" style="flex:1; padding:5px; background:none; border:none; color:var(--muted); font-size:11px; cursor:pointer;" class="emo-tab" data-cat="${cat}">${cat}</button>`).join('')}
               </div>
               <div id="emojiGrid" style="flex:1; overflow-y:auto; padding:10px; display:grid; grid-template-columns:repeat(7, 1fr); gap:5px;"></div>
            </div>

            <!-- GIF PICKER -->
            <div id="gifPickerCont" style="position:absolute; bottom:80px; left:15px; width:320px; height:400px; background:var(--dark2); border:1px solid var(--border); border-radius:12px; display:none; flex-direction:column; z-index:100; box-shadow:0 10px 40px rgba(0,0,0,0.8);">
               <div style="padding:10px; border-bottom:1px solid var(--border); display:flex; gap:5px;">
                 <input id="gifSearchInput" placeholder="Cari GIF..." style="flex:1; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:6px; color:#fff; padding:5px 10px; font-size:12px;" />
                 <button onclick="window.CimegaChat.searchGifs()" style="padding:5px; background:var(--cyan); border:none; border-radius:6px; cursor:pointer;">🔍</button>
               </div>
               <div id="gifResults" style="flex:1; overflow-y:auto; padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:8px;"></div>
            </div>

            <div style="display:flex; gap:12px; align-items:center;">
              <button onclick="window.CimegaChat.toggleEmoji()" style="background:none; border:none; font-size:24px; cursor:pointer;" title="Emoji">😊</button>
              <button onclick="window.CimegaChat.toggleGif()" style="background:none; border:none; font-size:24px; cursor:pointer;" title="GIF">🎬</button>
              <input id="chatInput" placeholder="Ketik pesan..." autocomplete="off" style="flex:1; background:rgba(0,229,255,0.05); border:1px solid rgba(0,229,255,0.2); border-radius:12px; padding:12px 20px; color:#fff; outline:none;" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); window.CimegaChat.send();}" />
              <button onclick="window.CimegaChat.send()" style="background:linear-gradient(135deg,#0066ff,#00e5ff); border:none; border-radius:50%; width:45px; height:45px; cursor:pointer; color:#fff; display:flex; align-items:center; justify-content:center;">🚀</button>
            </div>
          </div>
        </div>
      </div>
      <style>
        .chat-msg-wrapper { position: relative; max-width: 85%; transition: transform 0.2s; }
        .chat-bubble { position: relative; padding: 10px 20px 10px 12px; border-radius: 12px; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1); }
        .bubble-delete-btn { position: absolute; top: 4px; right: 4px; font-size: 10px; opacity: 0; cursor: pointer; color: rgba(255,255,255,0.4); }
        .chat-bubble:hover .bubble-delete-btn { opacity: 1; }
        .bubble-delete-btn:hover { color: #ff4466; transform: scale(1.2); }
        .chat-date-divider { display:flex; align-items:center; justify-content:center; margin: 20px 0; }
        .chat-date-label { padding: 4px 15px; background:rgba(0,0,0,0.4); border-radius:10px; font-size:11px; color:#fff; font-weight:700; border:1px solid rgba(255,255,255,0.1); }
        .emo-tab.active { color: var(--cyan) !important; font-weight: bold; border-bottom: 2px solid var(--cyan) !important; }
        .emoji-item { font-size: 20px; padding: 5px; cursor: pointer; text-align: center; border-radius: 6px; }
        .emoji-item:hover { background: rgba(255,255,255,0.1); }
        .spinner-sm { width:20px; height:20px; border:2px solid rgba(0,229,255,0.1); border-top-color:var(--cyan); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;
    this.renderEmojis(); // Render first time
  },

  toggleEmoji: function() {
    const el = document.getElementById('emojiPickerCont');
    const vis = el.style.display === 'flex';
    el.style.display = vis ? 'none' : 'flex';
    if (!vis) {
       document.getElementById('gifPickerCont').style.display = 'none';
       document.getElementById('emojiSearchInput').focus();
    }
  },

  renderEmojis: function(query = '', category) {
    if (category) this.targetCategory = category;
    const grid = document.getElementById('emojiGrid');
    if (!grid) return;

    // Update Tabs
    document.querySelectorAll('.emo-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-cat') === this.targetCategory));

    let list = [];
    if (query) {
       Object.values(this.emojiData).forEach(arr => {
         list = list.concat(arr); // In reality we'd have keywords, but for native we just show everything filtered by "existence" or just show all in search results
       });
    } else {
       list = this.emojiData[this.targetCategory] || [];
    }

    grid.innerHTML = list.map(e => `<div class="emoji-item" onclick="window.CimegaChat.insertEmoji('${e}')">${e}</div>`).join('');
  },

  insertEmoji: function(emoji) {
    const input = document.getElementById('chatInput');
    if (input) {
      input.value += emoji;
      input.focus();
    }
  },

  startMembersListener: function() {
    const { collection, query, where, onSnapshot } = window._fb;
    const q = query(collection(this.db, "users"), where("sekolah", "==", this.sekolah));
    this.unsubMembers = onSnapshot(q, (snap) => {
      const all = [];
      snap.forEach(d => all.push({ id: d.id, ...d.data() }));
      this.renderMembersList(all);
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
        msgs.push({
          id: d.id, sender: data.sender_name, senderId: data.sender_id,
          text, time: data.client_ts ? new Date(data.client_ts) : new Date(),
          deleted: data.deleted || false
        });
      }
      msgs.sort((a,b) => a.time - b.time);
      this.renderMessages(msgs);
    });
  },

  renderMembersList: function(members) {
    const cont = document.getElementById('chatMembersList');
    if (!cont) return;
    cont.innerHTML = '';
    let count = 0;
    const now = Date.now();
    members.forEach(m => {
       const online = m.is_online && (now/1000 - (m.last_seen?.seconds||0) < 120);
       if (online) count++;
       const isMe = m.id === this.currentUser.id;
       const div = document.createElement('div');
       div.style.cssText = `display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; background:rgba(255,255,255,0.03);`;
       div.innerHTML = `
         <div style="width:8px; height:8px; border-radius:50%; background:${online?'#ffcc00':'#666'};"></div>
         <div style="flex:1; min-width:0;">
           <div style="font-size:12px; font-weight:700; color:${isMe?'var(--cyan)':'#fff'}; overflow:hidden; text-overflow:ellipsis;">${m.nama}</div>
           <div style="font-size:9px; color:var(--muted);">${online?'Online':'Offline'}</div>
         </div>
       `;
       cont.appendChild(div);
    });
    const oc = document.getElementById('onlineCount');
    if (oc) oc.innerText = `• ${count} online`;
  },

  renderMessages: function(messages) {
    const history = document.getElementById('chatHistory');
    if (!history) return;

    const valid = messages.filter(m => m.time.getTime() > this.clearedAt && !m.deleted);
    const wasBottom = history.scrollHeight - history.scrollTop <= history.clientHeight + 100;

    history.innerHTML = '';
    let lastDate = '';

    valid.forEach(m => {
      const msgDate = m.time.toDateString();
      if (msgDate !== lastDate) {
        history.appendChild(this.createDateDivider(m.time));
        lastDate = msgDate;
      }

      const isMe = String(m.senderId) === String(this.currentUser.id);
      const timeStr = m.time.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
      const wrap = document.createElement('div');
      wrap.className = 'chat-msg-wrapper';
      wrap.style.cssText = `display:flex; flex-direction:column; align-self:${isMe?'flex-end':'flex-start'}; align-items:${isMe?'flex-end':'flex-start'};`;

      const isGif = m.text.includes('http');
      wrap.innerHTML = `
        <div style="font-size:10px; color:var(--cyan); margin:0 5px 2px 5px; font-weight:700;">${isMe?'Anda':m.sender}</div>
        <div class="chat-bubble" style="background:${isMe?'linear-gradient(135deg,#0055ee,#0033aa)':'rgba(255,255,255,0.08)'}; border-radius:${isMe?'16px 16px 4px 16px':'16px 16px 16px 4px'};">
           ${isMe ? `<span class="bubble-delete-btn" onclick="window.CimegaChat.deleteMessage('${m.id}')">🗑️</span>` : ''}
           ${isGif ? `<img src="${m.text}" style="max-width:200px; border-radius:10px; display:block;">` : `<div style="font-size:14px; line-height:1.5;">${this.escapeHtml(m.text)}</div>`}
           <div style="font-size:9px; opacity:0.6; text-align:right; margin-top:5px;">${timeStr}</div>
        </div>
      `;
      history.appendChild(wrap);
    });
    if (wasBottom) history.scrollTop = history.scrollHeight;
  },

  createDateDivider: function(date) {
    const now = new Date();
    let label = date.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
    if (date.toDateString() === now.toDateString()) label = 'HARI INI';
    else {
      const yest = new Date(); yest.setDate(now.getDate() - 1);
      if (date.toDateString() === yest.toDateString()) label = 'KEMARIN';
    }
    const div = document.createElement('div');
    div.className = 'chat-date-divider';
    div.innerHTML = `<div class="chat-date-label">${label}</div>`;
    return div;
  },

  toggleGif: function() {
    const el = document.getElementById('gifPickerCont');
    const vis = el.style.display === 'flex';
    el.style.display = vis ? 'none' : 'flex';
    if (!vis) document.getElementById('emojiPickerCont').style.display = 'none';
  },

  searchGifs: async function() {
    const query = document.getElementById('gifSearchInput')?.value;
    const res = document.getElementById('gifResults');
    if (!query || !res) return;
    res.innerHTML = '<div class="spinner-sm"></div>';
    try {
      const r = await fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${this.gifApiKey}&limit=8`);
      const { results } = await r.json();
      res.innerHTML = results.map(g => `<img src="${g.media_formats.tinygif.url}" style="width:100%; border-radius:6px; cursor:pointer;" onclick="window.CimegaChat.insertGif('${g.media_formats.tinygif.url}')">`).join('');
    } catch(e) { res.innerHTML = 'Gagal memuat GIF'; }
  },

  insertGif: function(url) {
    document.getElementById('chatInput').value = url;
    this.send();
    this.toggleGif();
  },

  send: async function() {
    const input = document.getElementById('chatInput');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      const payload = await this.encryptSafe(text);
      await addDoc(collection(this.db, "chats"), {
        sekolah: this.sekolah, sender_id: this.currentUser.id,
        sender_name: this.currentUser.nama, payload,
        client_ts: Date.now(), timestamp: serverTimestamp(), deleted: false
      });
    } catch(e) {}
  },

  deleteMessage: async function(id) {
    if (!confirm('Hapus pesan ini untuk semua orang?')) return;
    try {
      const { doc, updateDoc } = window._fb;
      await updateDoc(doc(this.db, "chats", id), { deleted: true, deleted_at: Date.now() });
    } catch(e) {}
  },

  clearChat: function() {
    if (!confirm('Hapus layar percakapan untuk Anda?')) return;
    const now = Date.now();
    localStorage.setItem(`cimega_chat_clear_${this.currentUser.id}_${this.sekolah}`, now.toString());
    this.clearedAt = now;
    this.renderMessages([]);
  },

  setPresence: async function(on) {
    if (!this.db || !this.currentUser.id || !window._fb) return;
    try {
      const { doc, updateDoc, serverTimestamp } = window._fb;
      await updateDoc(doc(this.db, "users", this.currentUser.id), { is_online: on, last_seen: serverTimestamp() });
    } catch(e) {}
  },

  decryptSafe: async function(p) { try { return p ? await window.CimegaCrypto.decrypt(p, this.schoolKey) : ''; } catch (e) { return p; } },
  encryptSafe: async function(t) { try { return t ? await window.CimegaCrypto.encrypt(t, this.schoolKey) : t; } catch (e) { return t; } },
  escapeHtml: function(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
};
