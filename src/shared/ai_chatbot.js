/**
 * Cimega AI Co-Pilot - shared/ai_chatbot.js
 * Intelligent role-based assistant with Smart Actions & Main Menu.
 * v3 - Stable with null-safe userData handling
 */

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
            <input id="aiChatInput" placeholder="Ketik atau pilih menu..." style="flex:1;background:rgba(170,85,255,0.05);border:1px solid rgba(170,85,255,0.2);border-radius:10px;padding:10px;color:#fff;outline:none;font-size:12px;" onkeydown="if(event.key==='Enter') window.CimegaAIChatbot.ask()"/>
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
          <input id="aiChatInput" placeholder="Ketik perintah atau pilih menu di atas..." style="flex:1;background:rgba(0,0,0,0.2);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:#fff;outline:none;font-size:13px;font-family:'Exo 2',sans-serif;" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); window.CimegaAIChatbot.ask();}"/>
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
    
    // Formatting Assignments (Sesuai data Admin)
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

    // Professional Greeting Logic
    const hour = new Date().getHours();
    let waktu = "Halo";
    if (hour >= 5 && hour < 11) waktu = "Selamat Pagi";
    else if (hour >= 11 && hour < 15) waktu = "Selamat Siang";
    else if (hour >= 15 && hour < 18) waktu = "Selamat Sore";
    else waktu = "Selamat Malam";

    const menuWrapper = document.createElement('div');
    menuWrapper.id = 'aiMainMenu';
    menuWrapper.style.cssText = 'animation: fadein 0.5s ease; width: 100%;';
    
    // Modern Identity Card UI
    menuWrapper.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(170,85,255,0.2),rgba(102,0,255,0.1));border:1px solid rgba(170,85,255,0.3);border-radius:18px;padding:20px;margin-bottom:20px;box-shadow:0 10px 30px rgba(0,0,0,0.2);position:relative;overflow:hidden;">
        <div style="position:absolute;top:-10px;right:-10px;font-size:80px;opacity:0.05;transform:rotate(15deg);">🤖</div>
        <div style="font-size:16px;color:#fff;font-weight:800;margin-bottom:4px;font-family:'Orbitron';">${waktu}, Bapak/Ibu ${userData.nama || 'Rekan'}!</div>
        <div style="font-size:11px;color:var(--cyan);font-weight:600;margin-bottom:12px;letter-spacing:0.5px;font-family:'Orbitron';">${userData.sekolah || 'Cimega Smart Office'}</div>
        
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          ${roles.map(r => `<span style="background:rgba(0,229,255,0.15);color:var(--cyan);padding:3px 8px;border-radius:6px;font-size:9px;font-weight:800;border:1px solid rgba(0,229,255,0.2);">${r.replace('_', ' ').toUpperCase()}</span>`).join('')}
        </div>
        
        <div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px;border:1px solid rgba(255,255,255,0.05);">
          <div style="font-size:9px;color:var(--muted);margin-bottom:2px;font-family:'Orbitron';">PENUGASAN AKTIF:</div>
          <div style="font-size:10px;color:#ddeeff;font-weight:600;display:flex;align-items:center;gap:4px;">
            <span>📍</span> ${assignedInfo}
          </div>
        </div>

        <div style="font-size:12px;color:rgba(255,255,255,0.9);line-height:1.6;margin-top:15px;border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;">
          Saya Cimega AI, siap membantu Anda menyelesaikan administrasi sekolah hari ini secara profesional. Apa yang bisa kita kerjakan bersama?
        </div>
      </div>

      <div style="font-size:10px;color:var(--muted);font-family:'Orbitron';letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
        <span style="flex:1;height:1px;background:rgba(255,255,255,0.1);"></span>
        ⚡ AKSI CEPAT RELEVAN
        <span style="flex:1;height:1px;background:rgba(255,255,255,0.1);"></span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        ${this.getMergedSuggestions(roles).map(s => `
          <div onclick="window.CimegaAIChatbot.quickAsk('${s.prompt.replace(/'/g, "\\'")}')" 
               style="background:rgba(255,255,255,0.03);border:1px solid rgba(170,85,255,0.15);border-radius:14px;padding:14px 10px;cursor:pointer;text-align:center;transition:all 0.3s;display:flex;flex-direction:column;align-items:center;gap:5px;"
               onmouseover="this.style.background='rgba(170,85,255,0.15)';this.style.borderColor='var(--cyan)';this.style.transform='translateY(-2px)'"
               onmouseout="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='rgba(170,85,255,0.15)';this.style.transform='translateY(0)'">
            <div style="font-size:24px;">${s.icon}</div>
            <div style="font-size:9px;font-weight:800;color:var(--cyan);font-family:'Orbitron';letter-spacing:0.5px;">${s.label.toUpperCase()}</div>
          </div>
        `).join('')}
      </div>
    `;
    history.appendChild(menuWrapper);
  },

  getMergedSuggestions: function(roles) {
    const suggestions = {
      guru: [
        { icon: '📝', label: 'Modul Ajar', prompt: 'Buatkan draf Modul Ajar berdiferensiasi untuk Bahasa Indonesia Fase C SD, lengkap dengan pertanyaan pemantik dan asesmen formatif.' },
        { icon: '🌱', label: 'Proyek P5', prompt: 'Buatkan ide dan alur Projek P5 Tema Gaya Hidup Berkelanjutan untuk SD Fase C, lengkap KENALI-SELIDIKI-LAKUKAN-GENAPI.' },
        { icon: '💡', label: 'Bank Soal HOTS', prompt: 'Buatkan 5 soal pilihan ganda HOTS (C4-C6) beserta stimulus kontekstual pada materi Siklus Air Kelas 5 SD.' },
        { icon: '📈', label: 'Narasi Rapor', prompt: 'Bantu saya membuat deskripsi narasi rapor Kurikulum Merdeka yang heartwarming namun jujur untuk siswa dengan kemampuan rata-rata.' },
      ],
      guru_pai: [
        { icon: '🕌', label: 'Modul PAI', prompt: 'Buatkan Modul Ajar PAI Fase C tentang Shalat Fardhu, metode simulasi praktik dan diskusi hikmah, siap cetak.' },
        { icon: '📿', label: 'Pantauan Ibadah', prompt: 'Buatkan format buku pantauan ibadah harian siswa SD (Shalat 5 Waktu, Mengaji, Puasa) yang menarik dan mudah diisi orang tua.' },
        { icon: '🎊', label: 'Proposal PHBI', prompt: 'Buatkan draf proposal Peringatan Isra Miraj lengkap dengan susunan panitia, anggaran, dan susunan acara.' },
        { icon: '🤲', label: 'Rubrik Praktik', prompt: 'Buatkan rubrik penilaian praktik Wudhu dan Shalat Fardhu dengan skor 1-4 yang objektif dan terperinci.' },
      ],
      guru_pjok: [
        { icon: '🏃', label: 'Modul PJOK', prompt: 'Buatkan Rencana Pembelajaran PJOK Fase C tentang Permainan Tradisional, modifikasi untuk halaman terbatas.' },
        { icon: '💪', label: 'Tes TKJI', prompt: 'Jelaskan prosedur Tes Kesegaran Jasmani Indonesia (TKJI) untuk siswa SD Kelas 4-6 beserta norma penilaiannya.' },
        { icon: '🏥', label: 'Laporan UKS', prompt: 'Buatkan template Laporan Bulanan Unit Kesehatan Sekolah (UKS) yang lengkap dan siap paraf kepala sekolah.' },
        { icon: '🥇', label: 'Program O2SN', prompt: 'Buatkan jadwal dan rencana pembinaan atlet SD untuk persiapan O2SN cabang atletik jarak 60 meter.' },
      ],
      kepsek: [
        { icon: '🔍', label: 'Supervisi Guru', prompt: 'Rancangkan instrumen supervisi akademik yang humanis dan memberdayakan untuk guru yang menerapkan pembelajaran berdiferensiasi.' },
        { icon: '📊', label: 'Analisis EDS', prompt: 'Bantu saya menganalisis hasil Evaluasi Diri Sekolah (EDS) untuk menyusun program prioritas di RKT.' },
        { icon: '👑', label: 'Visi & Misi', prompt: 'Bantu merumuskan Visi Misi sekolah yang selaras dengan 8 Dimensi Profil Pelajar Pancasila dan konteks lokal.' },
        { icon: '📋', label: 'Draf KOSP', prompt: 'Buatkan kerangka Bab I Karakteristik Satuan Pendidikan untuk Kurikulum Operasional Sekolah (KOSP) SD.' },
      ],
      bendahara: [
        { icon: '📑', label: 'Alokasi BOS', prompt: 'Bagaimana cara mengalokasikan dana BOSP yang benar sesuai juknis terbaru untuk belanja ATK dan pemeliharaan?' },
        { icon: '⚖️', label: 'Konsultasi Pajak', prompt: 'Jelaskan cara menghitung dan menyetorkan PPh 23 untuk jasa konsumsi/katering sekolah lengkap dengan tarifnya.' },
        { icon: '🧾', label: 'Panduan SPJ', prompt: 'Berikan panduan struktur kelengkapan dokumen SPJ pengadaan yang benar dan anti-temuan saat pemeriksaan BPK.' },
        { icon: '📊', label: 'Format RKAS', prompt: 'Bantu saya memahami dan mengisi dengan benar kolom-kolom utama dalam format e-RKAS sesuai juknis terbaru.' },
      ],
      ops: [
        { icon: '💻', label: 'Update Dapodik', prompt: 'Apa saja yang perlu diperbarui di Dapodik saat awal tahun ajaran baru? Berikan checklist lengkapnya.' },
        { icon: '📄', label: 'Draft Surat', prompt: 'Buatkan draf surat undangan rapat koordinasi guru untuk persiapan penilaian akhir semester sesuai tata naskah dinas.' },
        { icon: '🏫', label: 'Laporan Sarpras', prompt: 'Buatkan template rekap kondisi sarana prasarana sekolah yang siap diisi dan dilaporkan ke dinas pendidikan.' },
        { icon: '🎓', label: 'Proses PPDB', prompt: 'Jelaskan alur PPDB berbasis zonasi dan afirmasi untuk SD, beserta dokumen apa saja yang harus diverifikasi.' },
      ],
      tu: [
        { icon: '✉️', label: 'Surat Dinas', prompt: 'Buatkan template surat keterangan aktif sekolah untuk siswa yang format dan bahasanya sesuai tata naskah dinas.' },
        { icon: '📂', label: 'Arsip Kepeg.', prompt: 'Buatkan checklist dokumen kepegawaian yang harus ada dalam file personal setiap guru ASN dan Non-ASN.' },
        { icon: '📝', label: 'Surat Mutasi', prompt: 'Buatkan draf Surat Keterangan Pindah Sekolah untuk siswa mutasi keluar yang resmi dan lengkap.' },
        { icon: '📦', label: 'Inventaris ATK', prompt: 'Buatkan format buku mutasi barang habis pakai ATK bulanan yang praktis dan mudah diaudit.' },
      ],
      gpk: [
        { icon: '🔍', label: 'Profil ABK', prompt: 'Buatkan template Profil Asesmen Awal Anak Berkebutuhan Khusus (ABK) yang berbasis kekuatan, bukan deficit.' },
        { icon: '📋', label: 'Draf PPI', prompt: 'Bantu saya membuat kerangka Program Pembelajaran Individual (PPI) untuk siswa dengan hambatan belajar disleksia.' },
        { icon: '🤝', label: 'Panduan Ortu', prompt: 'Buatkan panduan singkat bahasa awam untuk orang tua tentang cara mendukung anak dengan hambatan perhatian (ADHD) di rumah.' },
        { icon: '📊', label: 'Rapor Inklusi', prompt: 'Buatkan contoh narasi laporan perkembangan ABK untuk rapor inklusi yang positif, jujur, and memberdayakan.' },
      ],
      ekskul: [
        { icon: '📋', label: 'Program Kerja', prompt: 'Buatkan Program Kerja Tahunan Ekskul Pramuka SD lengkap dengan jadwal, materi, dan target capaian SKU.' },
        { icon: '🏆', label: 'Persiapan Lomba', prompt: 'Buatkan jadwal latihan intensif 4 minggu untuk persiapan lomba MTQ tingkat kecamatan bagi siswa SD.' },
        { icon: '📝', label: 'Presensi Ekskul', prompt: 'Buatkan format daftar hadir ekskul yang juga mencatat perkembangan kemampuan anggota secara berkala.' },
        { icon: '🎊', label: 'Proposal Event', prompt: 'Buatkan draf proposal keikutsertaan dalam kejuaraan olahraga antar-SD lengkap dengan rincian biaya.' },
      ],
      koordinator: [
        { icon: '🎯', label: 'Desain P5', prompt: 'Bantu saya merancang alur proyek P5 Tema Bhinneka Tunggal Ika untuk SD yang melibatkan semua kelas secara kolaboratif.' },
        { icon: '📅', label: 'Jadwal P5', prompt: 'Buatkan kalender pelaksanaan P5 satu semester yang terintegrasi dengan kalender akademik dan tidak mengganggu jam intrakurikuler.' },
        { icon: '📊', label: 'Rubrik P5', prompt: 'Buatkan rubrik penilaian Proyek P5 untuk Dimensi Bergotong Royong dan Kreativitas dengan skala MB-BSH-BSB.' },
        { icon: '📑', label: 'LPJ Kokurikuler', prompt: 'Buatkan kerangka Laporan Pertanggungjawaban Program Kokurikuler P5 kepada Kepala Sekolah.' },
      ],
      fasilitator: [
        { icon: '👥', label: 'Dinamika Kelompok', prompt: 'Berikan panduan ice-breaking dan teknik membangun dinamika kelompok kecil yang efektif untuk siswa SD Fase C.' },
        { icon: '📓', label: 'Logbook Fasilitator', prompt: 'Buatkan template logbook harian fasilitator P5 yang praktis untuk mencatat progres, observasi karakter, dan kendala.' },
        { icon: '🔍', label: 'Observasi Karakter', prompt: 'Buatkan lembar observasi karakter P5 Dimensi Bernalar Kritis yang mudah diisi saat kegiatan proyek berlangsung.' },
        { icon: '📁', label: 'Portofolio Siswa', prompt: 'Jelaskan cara mengumpulkan dan mengorganisir portofolio karya P5 siswa yang baik sebagai bukti asesmen otentik.' },
      ],
      pustakawan: [
        { icon: '📚', label: 'Program Literasi', prompt: 'Buatkan Program Gerakan Literasi Sekolah (GLS) selama satu semester yang menarik, variatif, dan sesuai usia SD.' },
        { icon: '📝', label: 'Katalogisasi', prompt: 'Jelaskan cara mengklasifikasikan buku menggunakan sistem DDC untuk perpustakaan SD dengan simpel dan praktis.' },
        { icon: '📅', label: 'Kegiatan Perpus', prompt: 'Buatkan jadwal program mingguan perpustakaan: Storytime, Book Talk, Pojok Baca, dan Bookfair mini untuk SD.' },
        { icon: '📊', label: 'Statistik Perpus', prompt: 'Buatkan template laporan statistik bulanan perpustakaan (kunjungan, peminjaman, koleksi baru) yang siap cetak.' },
      ],
    };

    let mySugs = [];
    roles.forEach(r => {
      if (suggestions[r]) mySugs = mySugs.concat(suggestions[r]);
    });
    if (mySugs.length === 0) mySugs = suggestions['guru'];
    
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

      const systemPrompt = `### CIMEGA CO-PILOT — PROTOKOL ROLE-BASED ###
Identitas: Asisten AI khusus administrasi sekolah.
User Roles: ${roles.join(', ').toUpperCase()}.

BATASAN DOMAIN: Layani HANYA tugas yang sesuai dengan daftar Role di atas.
KURIKULUM: Wajib Kurikulum Merdeka 2025/2026. Gunakan CP, TP, ATP, Modul Ajar. 

KEBIJAKAN RESTRIKSI:
- Jika user meminta tugas role di luar daftar ${roles.join(', ').toUpperCase()}, TOLAK.
- Contoh: Jika role user bukan Bendahara, tolak urusan Pajak/BOS.
- Pesan Penolakan: "Mohon maaf, permintaan ini berada di luar wewenang Role asisten untuk Anda."

TANGGAPAN SMART ACTION: [ACTION:MODUL_AJAR], [ACTION:SURAT], [ACTION:RKAS], [ACTION:SUPERVISI].`;

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

