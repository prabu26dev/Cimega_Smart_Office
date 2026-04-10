window.ModulApproval = {
  container: null,
  antreanData: [],
  targetId: null,
  userData: null,

  init: async function() {
    this.container = document.getElementById('moduleApprovalApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    this.renderSkeleton();
    await this.loadData();
    this.render();
    this.initGrid();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `<div style="text-align:center;padding:50px;"><div class="spinner-glowing"></div><div style="margin-top:14px;color:var(--muted)">Memuat Antrean Persetujuan...</div></div>`;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const schoolId = this.userData.school_id || 'NPSN_MIGRATE';
      
      // Load from central approval queue or directly from modules
      // For this SaaS upgrade, we focus on documents tagged with waiting_approval
      const q = query(
        collection(db, 'antrean_dokumen'), 
        where('school_id', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      
      const snap = await getDocs(q);
      this.antreanData = [];
      snap.forEach(doc => {
        this.antreanData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) { console.error("Gagal memuat antrean:", e); }
  },

  render: function() {
    this.container.innerHTML = `
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
            <div style="font-size:11px;color:var(--muted); text-transform:uppercase;">Ditolak</div>
            <div style="font-family:'Orbitron',sans-serif; font-size:24px; font-weight:700; color:var(--danger); margin-top:5px;" id="countRej">0</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">✒️ SISTEM PERSETUJUAN MULTI-TENANT (TTE)</div>
          <button class="btn btn-ghost btn-sm" onclick="window.ModulApproval.mockAjukan()">Simulasi Pemohon</button>
        </div>
        <div class="card-body" id="gridWrapperApproval"></div>
      </div>

      <!-- PIN MODAL (GLASS) -->
      <div id="pinModal" style="display:none; position:fixed; inset:0; background:rgba(2, 11, 24, 0.9); z-index:9999; align-items:center; justify-content:center; backdrop-filter:blur(8px);">
        <div class="card" style="width:100%; max-width:360px; border-color:var(--cyan); box-shadow: 0 0 50px rgba(0,229,255,0.25);">
          <div class="card-body" style="text-align:center; padding:35px;">
            <div style="background:rgba(0,229,255,0.1); width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
               <span style="font-size:28px;">🔐</span>
            </div>
            <div style="font-family:'Orbitron',sans-serif; color:#fff; font-weight:700; font-size:14px; margin-bottom:10px; letter-spacing:1px;">VERIFIKASI PIN TTE</div>
            <div style="font-size:12px; color:var(--muted); margin-bottom:24px; line-height:1.5;">Otorisasi dokumen membutuhkan 6-digit PIN. Sertifikat TTE akan tersemat secara permanen.</div>
            
            <input type="password" id="ttePinInput" class="form-control" style="text-align:center; font-size:28px; letter-spacing:12px; font-family:'Orbitron',sans-serif; background:rgba(0,229,255,0.05); border-color:rgba(0,229,255,0.3); color:var(--cyan);" maxlength="6" placeholder="••••••" />
            
            <div style="display:flex; gap:12px; margin-top:28px;">
              <button class="btn btn-ghost" style="flex:1; justify-content:center; padding:12px;" onclick="document.getElementById('pinModal').style.display='none'">BATAL</button>
              <button class="btn btn-primary" style="flex:1; justify-content:center; padding:12px;" onclick="window.ModulApproval.executeApproval()">SAHKAN</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initGrid: function() {
    let w=0, a=0, r=0;
    
    const data = this.antreanData.map((d, idx) => {
      const status = d.status || 'waiting_approval';
      if(status === 'approved') a++;
      else if(status === 'rejected') r++;
      else w++;

      const statusLabels = {
        'waiting_approval': '<span style="color:var(--warn);font-weight:bold;">🕒 Menunggu</span>',
        'approved': '<span style="color:var(--success);font-weight:bold;">✅ Disetujui</span>',
        'rejected': '<span style="color:var(--danger);font-weight:bold;">❌ Ditolak</span>'
      };

      let action = '-';
      if(status === 'waiting_approval') {
        action = gridjs.html(`
          <div style="display:flex; gap:5px;">
            <button class='btn btn-success btn-sm' onclick='window.ModulApproval.promptPIN("${d.id}")'>Setujui</button>
            <button class='btn btn-danger btn-sm' onclick='window.ModulApproval.rejectDoc("${d.id}")'>Tolak</button>
          </div>
        `);
      } else if(status === 'approved') {
        action = gridjs.html(`<div style="font-size:10px; color:var(--muted); font-style:italic;">Trace: ${d.signatureTrace || 'TTE-VALID'}</div>`);
      }

      return [ 
        d.tipe || 'Dokumen', 
        d.judul || d.mapel || '-', 
        d.pemohon || d.teacher_name || 'Staff', 
        gridjs.html(statusLabels[status] || status), 
        action 
      ];
    });

    document.getElementById('countWait').innerText = w;
    document.getElementById('countApp').innerText = a;
    document.getElementById('countRej').innerText = r;

    new gridjs.Grid({
      columns: ['Jenis', 'Deskripsi/Judul', 'Pemohon', 'Status', 'Otorisasi'],
      data: data,
      search: true,
      pagination: { limit: 10 },
      style: {
        table: { border: 'none' },
        th: { background: 'rgba(157,78,221,0.08)', color: 'var(--violet-light)', fontSize: '11px' },
        td: { fontSize: '12px' }
      }
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
    const correctPin = window.kepsekPIN || '123456';
    
    if(input !== correctPin) {
      showToast('error', 'Otorisasi Gagal', 'PIN TTE yang Anda masukkan salah!');
      return;
    }

    try {
      const { doc, updateDoc, serverTimestamp } = window._fb;
      const tteTrace = `CIMEGA-TTE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      await updateDoc(doc(db, 'antrean_dokumen', this.targetId), {
        status: 'approved',
        signatureTrace: tteTrace,
        approvedBy: this.userData.nama,
        updatedAt: serverTimestamp()
      });

      document.getElementById('pinModal').style.display = 'none';
      showToast('success', 'Selesai', 'Dokumen berhasil disahkan secara elektronik.');
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  rejectDoc: async function(id) {
    if(!confirm("Anda yakin menolak dokumen ini?")) return;
    try {
      const { doc, updateDoc, serverTimestamp } = window._fb;
      await updateDoc(doc(db, 'antrean_dokumen', id), { 
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
      showToast('warn', 'Ditolak', 'Dokumen telah dikembalikan ke pemohon.');
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  mockAjukan: async function() {
    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'antrean_dokumen'), { 
        tipe: 'MODUL',
        judul: 'Simulasi Modul Ajar Matematika',
        pemohon: 'Guru Simulasi',
        school_id: this.userData.school_id || 'NPSN_MIGRATE',
        status: 'waiting_approval',
        createdAt: serverTimestamp() 
      });
      this.init();
    } catch(e) { showToast('error', 'Gagal', e.message); }
  }
};
