/**
 * Cimega Smart Office - Encrypted Multi-Tenant Chat
 * Secure collaboration within the same school_id.
 */

window.CimegaChat = {
  db: null,
  schoolId: null,
  schoolKey: null,
  currentUser: null,
  unsubscribe: null,

  init: async function(dbInstance) {
    this.db = dbInstance;
    const userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    if (!userData.school_id || userData.role === 'admin') return;

    this.schoolId = userData.school_id;
    this.schoolKey = userData.school_key;
    this.currentUser = userData;

    this.injectUI();
    this.listenMessages();
  },

  injectUI: function() {
    const chatHTML = `
      <div id="cimegaChatContainer" style="position:fixed; bottom:20px; right:20px; z-index:9999; font-family:'Exo 2', sans-serif;">
        <div id="chatBubble" onclick="CimegaChat.toggleChat()" style="width:56px; height:56px; background:linear-gradient(135deg, #0066ff, #00e5ff); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 8px 24px rgba(0,229,255,0.4); transition:all 0.3s; border:2px solid rgba(255,255,255,0.2);">
          <span style="font-size:24px;">💬</span>
          <div id="chatBadge" style="position:absolute; top:0; right:0; width:12px; height:12px; background:#ff4466; border-radius:50%; border:2px solid #fff; display:none;"></div>
        </div>
        
        <div id="chatWindow" style="display:none; width:340px; height:480px; background:rgba(4, 20, 45, 0.95); border:1px solid rgba(0,229,255,0.3); border-radius:16px; position:absolute; bottom:70px; right:0; flex-direction:column; overflow:hidden; backdrop-filter:blur(20px); box-shadow:0 12px 40px rgba(0,0,0,0.6);">
          <div style="padding:15px; background:rgba(0,229,255,0.1); border-bottom:1px solid rgba(0,229,255,0.2); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-family:'Orbitron', sans-serif; font-size:12px; color:#fff; font-weight:700; letter-spacing:1px;">CIPER CHAT 🔒</div>
              <div style="font-size:10px; color:var(--cyan); margin-top:2px;">Internal: ${this.currentUser.sekolah}</div>
            </div>
            <button onclick="CimegaChat.toggleChat()" style="background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px;">✕</button>
          </div>
          <div id="chatHistory" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth;">
             <div style="text-align:center; font-size:10px; color:var(--muted); margin:10px 0;">🛡️ Pesan dienkripsi AES-256 end-to-end</div>
          </div>
          <div style="padding:12px; border-top:1px solid rgba(0,229,255,0.2); display:flex; gap:8px;">
            <input id="chatInput" placeholder="Ketik pesan..." style="flex:1; background:rgba(0,229,255,0.05); border:1px solid rgba(0,229,255,0.2); border-radius:8px; padding:10px; color:#fff; outline:none; font-size:13px;" onkeydown="if(event.key==='Enter') CimegaChat.send()"/>
            <button onclick="CimegaChat.send()" style="background:var(--blue); border:none; border-radius:8px; width:40px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff;">🚀</button>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);
  },

  toggleChat: function() {
    const win = document.getElementById('chatWindow');
    const isVisible = win.style.display === 'flex';
    win.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
      document.getElementById('chatBadge').style.display = 'none';
      const history = document.getElementById('chatHistory');
      history.scrollTop = history.scrollHeight;
    }
  },

  listenMessages: function() {
    const { collection, query, where, orderBy, limit, onSnapshot } = window._fb;
    const q = query(
      collection(this.db, "chats"),
      where("school_id", "==", this.schoolId),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    this.unsubscribe = onSnapshot(q, async (snapshot) => {
      const messages = [];
      for (const d of snapshot.docs) {
        const data = d.data();
        let decryptedText = "Error decrypting...";
        try {
          decryptedText = await window.CimegaCrypto.decrypt(data.payload, this.schoolKey);
        } catch (e) { decryptedText = data.payload; } // fallback if plaintext
        
        messages.push({
          id: d.id,
          sender: data.sender_name,
          senderId: data.sender_id,
          text: decryptedText,
          time: data.timestamp ? data.timestamp.toDate() : new Date()
        });
      }
      this.renderMessages(messages.reverse());
    });
  },

  renderMessages: function(msgs) {
    const history = document.getElementById('chatHistory');
    const win = document.getElementById('chatWindow');
    
    // Check if new message arrived while closed
    if (win.style.display === 'none' && msgs.length > 0) {
       document.getElementById('chatBadge').style.display = 'block';
    }

    history.innerHTML = `<div style="text-align:center; font-size:10px; color:var(--muted); margin:10px 0;">🛡️ Pesan dienkripsi AES-256 end-to-end</div>`;
    msgs.forEach(m => {
      const isMe = m.senderId === this.currentUser.id;
      const msgDiv = document.createElement('div');
      msgDiv.style.cssText = `display:flex; flex-direction:column; align-items: ${isMe ? 'flex-end' : 'flex-start'}; gap:2px;`;
      
      const timeStr = m.time.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
      
      msgDiv.innerHTML = `
        <div style="font-size:9px; color:var(--muted); margin-${isMe?'right':'left'}:4px">${isMe ? 'Anda' : m.sender} · ${timeStr}</div>
        <div style="max-width:85%; padding:8px 12px; border-radius:12px; font-size:13px; line-height:1.4; background:${isMe ? 'linear-gradient(135deg, #0066ff, #0044cc)' : 'rgba(255,255,255,0.08)'}; color:${isMe ? '#fff' : '#e0f4ff'}; border:1px solid ${isMe ? 'rgba(255,255,255,0.1)' : 'rgba(0,229,255,0.1)'}">
          ${m.text}
        </div>
      `;
      history.appendChild(msgDiv);
    });
    history.scrollTop = history.scrollHeight;
  },

  send: async function() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    input.value = '';
    const { collection, addDoc, serverTimestamp } = window._fb;
    
    try {
      const encrypted = await window.CimegaCrypto.encrypt(text, this.schoolKey);
      await addDoc(collection(this.db, "chats"), {
        school_id: this.schoolId,
        sender_id: this.currentUser.id,
        sender_name: this.currentUser.nama,
        payload: encrypted,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  }
};
