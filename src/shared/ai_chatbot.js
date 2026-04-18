// ── CIMEGA SMART OFFICE: AI CO-PILOT ──────────────────────────────

window.CimegaAIChatbot = {

  getUserData: function() {
    return JSON.parse(localStorage.getItem('cimega_user') || '{}');
  },

  getUserRoles: function() {
    const u = this.getUserData();
    if (Array.isArray(u.roles) && u.roles.length > 0) return u.roles;
    if (u.role) return [u.role];
    return ['guru'];
  },

  init: function(containerId) {
    if (containerId) {
      this.renderTo(containerId);
      return;
    }
    const existing = document.getElementById('aiChatbotContainer');
    if (existing) existing.remove();

    const userData = this.getUserData();
    const chatbotHTML = `
      <div id="aiChatbotContainer" style="position:fixed;bottom:20px;left:20px;z-index:9998;font-family:'Exo 2',sans-serif;">
        <div onclick="window.CimegaAIChatbot.toggle()" style="width:52px;height:52px;background:linear-gradient(135deg,#aa55ff,#6600ff);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(170,85,255,0.4);position:relative;transition:all 0.2s;">
          <span style="font-size:22px;">🤖</span>
          <div style="position:absolute;top:-4px;right:-4px;background:var(--cyan);color:#000;font-size:8px;font-weight:900;padding:2px 4px;border-radius:8px;font-family:'Orbitron';">AI</div>
        </div>
        <div id="aiChatWindow" style="display:none;width:360px;height:520px;background:rgba(4,20,45,0.98);border:1px solid rgba(170,85,255,0.4);border-radius:20px;position:absolute;bottom:62px;left:0;flex-direction:column;overflow:hidden;backdrop-filter:blur(25px);box-shadow:0 15px 50px rgba(0,0,0,0.8);">
          <div style="padding:14px 18px;background:rgba(170,85,255,0.15);border-bottom:1px solid rgba(170,85,255,0.2);display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:8px;height:8px;border-radius:50%;background:var(--success);box-shadow:0 0 8px var(--success);"></div>
              <div style="font-family:'Orbitron';font-size:11px;color:#fff;font-weight:700;">CO-PILOT AI</div>
            </div>
            <button onclick="window.CimegaAIChatbot.toggle()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;line-height:1;">✕</button>
          </div>
          <div id="aiChatHistory" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;"></div>
          <div id="aiTyping" style="display:none;padding:8px 14px;font-size:11px;color:var(--cyan);font-style:italic;">AI sedang berpikir...</div>
          <div style="padding:12px;border-top:1px solid rgba(170,85,255,0.2);display:flex;gap:8px;background:rgba(0,0,0,0.2);">
            <input id="aiChatInput" placeholder="Ketik instruksi administrasi Anda..." style="flex:1;background:rgba(170,85,255,0.05);border:1px solid rgba(170,85,255,0.2);border-radius:10px;padding:10px;color:#fff;outline:none;font-size:12px;" onkeydown="if(event.key==='Enter') window.CimegaAIChatbot.ask()"/>
            <button id="aiSendBtn" onclick="window.CimegaAIChatbot.ask()" style="background:linear-gradient(135deg,#aa55ff,#6600ff);border:none;border-radius:10px;width:40px;cursor:pointer;color:#fff;font-size:14px;">✨</button>
          </div>
        </div>
      </div>`;

    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);
    this.renderMainMenuInto('aiChatHistory');
  },

  renderTo: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const userData = this.getUserData();

    container.innerHTML = `
      <div id="aiChatbotEmbedded" style="display:flex;flex-direction:column;height:calc(100vh - 150px);background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
        <div style="padding:16px 20px;background:rgba(170,85,255,0.1);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:9px;height:9px;border-radius:50%;background:var(--success);box-shadow:0 0 10px var(--success);"></div>
            <div style="font-family:'Orbitron';font-size:12px;color:#fff;font-weight:700;letter-spacing:1px;">CIMEGA CO-PILOT AI 🤖</div>
          </div>
          <div style="font-size:10px;color:var(--muted);font-family:'Orbitron';">GEMINI 2.5 FLASH</div>
        </div>
        <div id="aiChatHistory" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth;"></div>
        <div id="aiTyping" style="display:none;padding:10px 20px;font-size:11px;color:var(--cyan);font-style:italic;">AI sedang memproses...</div>
        <div style="padding:16px 20px;border-top:1px solid var(--border);display:flex;gap:10px;background:rgba(0,0,0,0.08);">
          <input id="aiChatInput" placeholder="Ketik instruksi atau perintah administrasi..." style="flex:1;background:rgba(0,0,0,0.2);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:#fff;outline:none;font-size:13px;font-family:'Exo 2',sans-serif;" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); window.CimegaAIChatbot.ask();}"/>
          <button id="aiSendBtn" onclick="window.CimegaAIChatbot.ask()" style="background:linear-gradient(135deg,#aa55ff,#6600ff);border:none;border-radius:12px;width:50px;cursor:pointer;color:#fff;font-size:16px;transition:transform 0.15s;" onmousedown="this.style.transform='scale(0.92)'" onmouseup="this.style.transform='scale(1)'">✨</button>
        </div>
      </div>`;

    this.renderMainMenuInto('aiChatHistory');
  },

  renderMainMenuInto: function(historyId) {
    const history = document.getElementById(historyId);
    if (!history) return;
    history.innerHTML = '';

    const userData = this.getUserData();
    const roles = this.getUserRoles();
    
    // ★ USER IDENTITY & ASSIGNMENTS ★
    let assignedInfo = "";
    if (userData.teaching_assignments) {
      const { classes, phases } = userData.teaching_assignments;
      let parts = [];
      if (phases?.length) parts.push(`Fase: ${phases.join(', ')}`);
      if (classes?.length) parts.push(`Unit: ${classes.join(', ')}`);
      assignedInfo = parts.join(' · ');
    } else if (userData.wali_kelas) {
      assignedInfo = `Wali Kelas: ${userData.wali_kelas}`;
    } else {
      assignedInfo = "Administrasi Staf & Manajemen";
    }

    // ★ GREETING LOGIC ★
    const hour = new Date().getHours();
    let waktu = "Halo";
    if (hour >= 5 && hour < 11) waktu = "Selamat Pagi";
    else if (hour >= 11 && hour < 15) waktu = "Selamat Siang";
    else if (hour >= 15 && hour < 18) waktu = "Selamat Sore";
    else waktu = "Selamat Malam";

    const menuWrapper = document.createElement('div');
    menuWrapper.id = 'aiMainMenu';
    menuWrapper.style.cssText = 'animation: fadein 0.5s ease; width: 100%;';
    
    // ★ IDENTITY CARD UI ★
    menuWrapper.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(170,85,255,0.2),rgba(102,0,255,0.1));border:1px solid rgba(170,85,255,0.3);border-radius:18px;padding:20px;margin-bottom:20px;box-shadow:0 10px 30px rgba(0,0,0,0.2);position:relative;overflow:hidden;">
        <div style="position:absolute;top:-10px;right:-10px;font-size:80px;opacity:0.05;transform:rotate(15deg);">🤖</div>
        <div style="font-size:16px;color:#fff;font-weight:800;margin-bottom:4px;font-family:'Orbitron';">${waktu}, Bapak/Ibu ${userData.nama || 'Rekan'}!</div>
        <div style="font-size:11px;color:var(--cyan);font-weight:600;margin-bottom:12px;letter-spacing:0.5px;font-family:'Orbitron';">${userData.sekolah || 'Cimega Smart Office'}</div>
        
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          ${roles.map(r => `<span style="background:rgba(0,229,255,0.15);color:var(--cyan);padding:3px 8px;border-radius:6px;font-size:9px;font-weight:800;border:1px solid rgba(0,229,255,0.2);">${r.replace('_', ' ').toUpperCase()}</span>`).join('')}
        </div>
        
        <div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px;border:1px solid rgba(255,255,255,0.05);">
          <div style="font-size:10px; color:var(--muted); margin-bottom:10px;">MARGIN (MM) - STANDAR DOKUMEN</div>
          <div style="font-size:10px;color:#ddeeff;font-weight:600;display:flex;align-items:center;gap:4px;">
            <span>📍</span> ${assignedInfo}
          </div>
        </div>

        <div style="font-size:12px;color:rgba(255,255,255,0.9);line-height:1.6;margin-top:15px;border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;">
          Saya Cimega AI, siap membantu Anda menyelesaikan administrasi sekolah hari ini secara profesional. Apa yang bisa kita kerjakan bersama?
        </div>
      </div>

      </div>
    `;
    history.appendChild(menuWrapper);
  },

  getMergedSuggestions: function(roles) {
    const suggestions = {
      guru: [
        { icon: '📝', label: 'Tulis Artikel', prompt: 'Bantu saya menulis artikel edukatif singkat tentang teknologi masa depan.' },
        { icon: '📊', label: 'Analisis Data', prompt: 'Bantu saya menganalisis tren data sederhana dan memberikan insight.' },
        { icon: '💬', label: 'Draf Pesan', prompt: 'Buatkan draf pesan formal untuk korespondensi profesional.' },
      ]
    };

    let mySugs = suggestions['guru'];
    
    return mySugs.filter((v, i, a) => a.findIndex(t => t.label === v.label) === i).slice(0, 6);
  },


  quickAsk: function(promptText) {
    const m = document.getElementById('aiMainMenu');
    if (m) m.remove();

    const input = document.getElementById('aiChatInput');
    if (input) {
      input.value = promptText;
      this.ask();
    }
  },

  toggle: function() {
    const win = document.getElementById('aiChatWindow');
    if (!win) return;
    const isOpen = win.style.display !== 'flex';
    win.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      const inp = document.getElementById('aiChatInput');
      if (inp) inp.focus();
    }
  },

  getEl: function(id) {
    const embedded = document.getElementById('aiChatbotEmbedded');
    if (embedded) {
      const el = embedded.querySelector('#' + id);
      if (el) return el;
    }
    return document.getElementById(id);
  },

  ask: async function() {
    const input = this.getEl('aiChatInput');
    const sendBtn = this.getEl('aiSendBtn');
    const typing = this.getEl('aiTyping');

    if (!input || !input.value.trim()) return;
    const text = input.value.trim();

    const mainMenu = document.getElementById('aiMainMenu');
    if (mainMenu) mainMenu.remove();

    this.renderMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    if (typing) typing.style.display = 'block';

    try {
      const roles = this.getUserRoles();
      const userData = this.getUserData();
      const currentTitle = document.querySelector('.section-title')?.innerText || 'BERANDA';

      const systemPrompt = `### CIMEGA CO-PILOT — PROTOKOL ADVANCED v4 ###
Asisten: Ahli Administrasi Sekolah (SDN Cimega / ${userData.sekolah || 'Global'}).
Konteks User: [Nama: ${userData.nama || 'User'}], [Role: ${roles.join(', ').toUpperCase()}].
Lokasi Aplikasi Sekarang: [${currentTitle}].

TUGAS UTAMA:
- Berikan saran administrasi Kurikulum Merdeka 2025/2026.
- Sesuaikan gaya bahasa: Profesional, Santun, namun To-The-Point.
- Jika user sedang di menu "${currentTitle}", utamakan bantuan terkait menu tersebut.

BATASAN KEAMANAN & WEWENANG:
- HANYA layani tugas sesuai Role ${roles.join(', ').toUpperCase()}.
- JANGAN berikan data finansial jika Role bukan Bendahara/Kepsek.
- Jika di luar wewenang, balas: "Mohon maaf, permintaan ini berada di luar wewenang Role asisten untuk Anda."

RESPONSE TAGGING:
Tanggapi dengan tag [ACTION:TYPE] jika relevan (MODUL_AJAR, SURAT, RKAS, SUPERVISI).`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: text }]
      });

      if (res.error) throw new Error(res.error);

      let cleanText = res.text;
      let actionTag = null;
      const match = cleanText.match(/\[ACTION:(\w+)\]/);
      if (match) {
        actionTag = match[1];
        cleanText = cleanText.replace(/\[ACTION:\w+\]/g, '').trim();
      }

      this.renderMessage(cleanText, 'ai', actionTag);
    } catch (e) {
      this.renderMessage('⚠️ Terjadi kesalahan: ' + e.message, 'ai');
    } finally {
      if (typing) typing.style.display = 'none';
      if (input) { input.disabled = false; input.focus(); }
      if (sendBtn) sendBtn.disabled = false;
    }
  },

  renderMessage: function(text, sender, action = null) {
    const history = this.getEl('aiChatHistory');
    if (!history) return;

    const isMe = sender === 'user';
    const div = document.createElement('div');
    div.style.cssText = `
      align-self:${isMe?'flex-end':'flex-start'};
      max-width:87%;
      padding:11px 15px;
      border-radius:${isMe?'14px 14px 3px 14px':'14px 14px 14px 3px'};
      font-size:13px; line-height:1.55;
      background:${isMe?'linear-gradient(135deg,#0055cc,#003da5)':'rgba(255,255,255,0.055)'};
      color:${isMe?'#fff':'#ddeeff'};
      border:1px solid ${isMe?'rgba(0,229,255,0.25)':'rgba(170,85,255,0.2)'};
      box-shadow:0 3px 12px rgba(0,0,0,0.12);
      word-break:break-word;
    `;

    div.innerHTML = text.replace(/\n/g, '<br>');

    if (action) {
      const btn = document.createElement('button');
      btn.style.cssText = 'display:block;margin-top:10px;width:100%;padding:7px 12px;background:var(--cyan);color:#000;border:none;border-radius:8px;font-family:Orbitron;font-size:10px;font-weight:700;cursor:pointer;';
      btn.innerText = `⚡ BUKA MODUL ${action.replace('_', ' ')}`;
      btn.onclick = () => this.triggerAction(action);
      div.appendChild(btn);
    }

    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  },

  triggerAction: function(type) {
    const findNavAndClick = (keyword) => {
      const items = Array.from(document.querySelectorAll('.nav-item'));
      const item = items.find(el => el.innerText.toLowerCase().includes(keyword));
      if (item) item.click();
    };

    if (type === 'MODUL_AJAR') findNavAndClick('perencanaan');
    else if (type === 'SURAT') findNavAndClick('e-office');
    else if (type === 'RKAS') findNavAndClick('rkas');
    else if (type === 'SUPERVISI') findNavAndClick('supervisi');
  }
};

