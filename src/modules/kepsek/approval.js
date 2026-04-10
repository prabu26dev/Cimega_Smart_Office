window.ModulApproval = {
  container: null,
  antreanData: [],
  targetId: null,

  init: async function() {
    this.container = document.getElementById('moduleApprovalApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner-glowing"></div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const q = query(collection(db, 'antrean_dokumen'), where('sekolah', '==', userData.sekolah || ''), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      
      this.antreanData = [];
      snap.forEach(doc => {
        this.antreanData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) { console.error("Gagal memuat antrean:", e); }
  },

  render: function() {
    this.container.innerHTML = `
      <!-- NOTIFICATION SUMMARY -->
      <div class="grid-3" style="margin-bottom:20px;">
        <div class="card" style="margin-bottom:0; background:rgba(255,170,0,0.05); border-color:rgba(255,170,0,0.2);">
          <div class="card-body" style="text-align:center;">
            <div style="font-size:11px;color:var(--muted); text-transform:uppercase;">Menunggu Persetujuan</div>
            <div style="font-family:'Orbitron',sans-serif; font-size:24px; font-weight:700; color:var(--warn); margin-top:5px;" id="countWait">0</div>
          </div>
        </div>
        <div class="card" style="margin-bottom:0; background:rgba(0,255,136,0.05); border-color:rgba(0,255,136,0.2);">
          <div class="card-body" style="text-align:center;">
            <div style="font-size:11px;color:var(--muted); text-transform:uppercase;">Disetujui (TTE)</div>
            <div style="font-family:'Orbitron',sans-serif; font-size:24px; font-weight:700; color:var(--success); margin-top:5px;" id="countApp">0</div>
          </div>
        </div>
        <div class="card" style="margin-bottom:0; background:rgba(255,68,102,0.05); border-color:rgba(255,68,102,0.2);">
          <div class="card-body" style="text-align:center;">
            <div style="font-size:11px;color:var(--muted); text-transform:uppercase;">Ditolak / Dikembalikan</div>
            <div style="font-family:'Orbitron',sans-serif; font-size:24px; font-weight:700; color:var(--danger); margin-top:5px;" id="countRej">0</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">✒️ ANTREAN DOKUMEN & PERSETUJUAN (TTE)</div>
          <div>
            <button class="btn btn-ghost btn-sm" onclick="window.ModulApproval.mockAjukan()">+ (Simulasi Pemohon)</button>
          </div>
        </div>
        <div class="card-body">
          <div id="gridWrapperApproval"></div>
        </div>
      </div>

      <!-- PIN MODAL -->
      <div id="pinModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999; align-items:center; justify-content:center;">
        <div class="card" style="width:100%; max-width:350px; border-color:var(--cyan); box-shadow: 0 0 40px rgba(0,229,255,0.2);">
          <div class="card-body" style="text-align:center; padding:30px;">
            <span style="font-size:30px; margin-bottom:10px; display:block;">🔒</span>
            <div style="font-family:'Orbitron',sans-serif; color:var(--cyan); font-weight:700; font-size:14px; margin-bottom:5px;">OTORISASI TTE DIBUTUHKAN</div>
            <div style="font-size:11px; color:var(--muted); margin-bottom:20px;">Masukkan 6-Digit PIN Anda untuk mengesahkan dokumen secara elektronik. PIN yang sah bersifat final.</div>
            
            <input type="password" id="ttePinInput" class="form-control" style="text-align:center; font-size:24px; letter-spacing:10px; font-family:'Orbitron',sans-serif;" maxlength="6" placeholder="******" />
            
            <div style="display:flex; gap:10px; margin-top:20px;">
              <button class="btn btn-ghost" style="flex:1; justify-content:center;" onclick="document.getElementById('pinModal').style.display='none'">Batal</button>
              <button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="window.ModulApproval.executeApproval()">Sahkan</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initGrid: function() {
    let w=0, a=0, r=0;
    
    const data = this.antreanData.map((d, idx) => {
      if(d.status === 'Disetujui') a++;
      else if(d.status === 'Ditolak') r++;
      else w++;

      let badge = '';
      if(d.status === 'Menunggu') badge = '<span style="color:var(--warn);font-weight:bold;">🕒 Menunggu</span>';
      else if(d.status === 'Disetujui') badge = '<span style="color:var(--success);font-weight:bold;">✅ Disetujui</span>';
      else badge = '<span style="color:var(--danger);font-weight:bold;">❌ Ditolak</span>';

      let action = '-';
      if(d.status === 'Menunggu') {
        action = gridjs.html(`
          <button class='btn btn-success btn-sm' onclick='window.ModulApproval.promptPIN("\${d.id}")'>Setujui (TTE)</button>
          <button class='btn btn-danger btn-sm' onclick='window.ModulApproval.rejectDoc("\${d.id}")'>Tolak</button>
        `);
      } else {
        // If approved, verify TTE trace simulation
        if(d.status === 'Disetujui') action = gridjs.html(`<span style="font-size:10px; color:var(--muted);">Sertifikat TTE: <i>\${d.signatureTrace}</i></span>`);
      }

      return [ d.tipe || '-', d.judul || '-', d.pemohon || '-', gridjs.html(badge), action ];
    });

    document.getElementById('countWait').innerText = w;
    document.getElementById('countApp').innerText = a;
    document.getElementById('countRej').innerText = r;

    new gridjs.Grid({
      columns: ['Tipe Dokumen', 'Ringkasan', 'Pemohon', 'Status', 'Otorisasi TTE'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      language: { search: { placeholder: 'Cari Antrean...' } }
    }).render(document.getElementById('gridWrapperApproval'));
  },

  promptPIN: function(id) {
    this.targetId = id;
    document.getElementById('ttePinInput').value = '';
    document.getElementById('pinModal').style.display = 'flex';
    document.getElementById('ttePinInput').focus();
  },

  executeApproval: async function() {
    const input = document.getElementById('ttePinInput').value;
    
    // Strict match against logical stored PIN (fallback is 123456 defined in kepsek.html)
    if(input !== window.kepsekPIN) {
      alert("❌ PIN TTE Salah! Otorisasi ditolak.");
      return;
    }

    // Success Authentication
    try {
      const { doc, updateDoc } = window._fb;
      const tteTrace = `TTE-\${Math.random().toString(36).substr(2, 9).toUpperCase()}-VLD`; // Mock digital trace
      
      await updateDoc(doc(db, 'antrean_dokumen', this.targetId), {
        status: 'Disetujui',
        signatureTrace: tteTrace,
        approvedAt: new Date().toISOString()
      });

      document.getElementById('pinModal').style.display = 'none';
      alert("✅ Dokumen berhasil disahkan dengan Elektronik Signature!");
      this.init(); // Reload
    } catch(e) { alert("Sistem Kesalahan: " + e.message); }
  },

  rejectDoc: async function(id) {
    if(!confirm("Anda yakin menolak dokumen ini dan mengembalikannya ke pemohon?")) return;
    try {
      const { doc, updateDoc } = window._fb;
      await updateDoc(doc(db, 'antrean_dokumen', id), { status: 'Ditolak' });
      this.init();
    } catch(e) { alert(e.message); }
  },

  mockAjukan: async function() {
    // Function to simulate OPS/Bendahara submitting a document for approval
    const tipe = prompt("Masukkan Tipe Dokumen (SPJ/Surat):", "SPJ BOSP Bulan Lalu");
    const pemohon = prompt("Nama Pemohon:", "Bendahara BOS");
    if(!tipe || !pemohon) return;

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'antrean_dokumen'), { 
        tipe: 'SPJ',
        judul: tipe,
        pemohon: pemohon,
        status: 'Menunggu',
        sekolah: userData.sekolah,
        createdAt: serverTimestamp() 
      });
      this.init();
    } catch(e) { alert(e.message); }
  }
};
