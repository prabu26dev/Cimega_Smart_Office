window.AdminInstitusi = {
  container: null,
  schools: [],

  init: async function() {
    this.container = document.getElementById('adminInstitusiApp');
    this.renderSkeleton();
    await this.loadData();
    this.render();
  },

  renderSkeleton: function() {
    this.container.innerHTML = `
      <div style="text-align:center;padding:50px;">
        <div class="spinner" style="border-top-color:var(--cyan);width:30px;height:30px"></div>
        <div style="margin-top:14px;color:var(--muted)">Memuat Data Institusi...</div>
      </div>
    `;
  },

  loadData: async function() {
    try {
      const { collection, getDocs, orderBy, query } = window._fb;
      this.schools = [];
      const snap = await getDocs(query(collection(db, 'sekolah'), orderBy('nama', 'asc')));
      snap.forEach(doc => {
        this.schools.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat data institusi:", e);
    }
  },

  render: function() {
    let rows = this.schools.map((s, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${s.npsn || '-'}</strong></td>
        <td><span style="color:var(--cyan);font-weight:600">${s.nama || '-'}</span></td>
        <td>${s.kepsek || '-'}</td>
        <td><span class="badge badge-${s.status === 'aktif' ? 'active' : 'inactive'}">${s.status || 'aktif'}</span></td>
        <td>
          <div style="display:flex;gap:5px">
             <button class="btn btn-ghost btn-sm" onclick="openModalSekolah('${s.id}')">✏️ Edit</button>
             <button class="btn btn-danger btn-sm" onclick="konfirmasiHapus('sekolah','${s.id}','${(s.nama||'').replace(/'/g,"\\'")}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    if (this.schools.length === 0) {
      rows = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">Belum ada data institusi terdaftar.</td></tr>`;
    }

    this.container.innerHTML = `
      <div class="section-header">
        <div class="section-title">Informasi <span>Institusi & Tenant</span></div>
        <button class="btn btn-gold" onclick="openModalSekolah()">+ Tambah Institusi Baru</button>
      </div>
      
      <div class="stats-row" style="margin-bottom:16px">
         <div class="stat-card blue" style="padding:15px">
            <div class="stat-card-num">${this.schools.length}</div>
            <div class="stat-card-label">Total Sekolah</div>
         </div>
         <div class="stat-card green" style="padding:15px">
            <div class="stat-card-num">${this.schools.filter(s => s.status === 'aktif').length}</div>
            <div class="stat-card-label">Sekolah Aktif</div>
         </div>
         <div class="stat-card cyan" style="padding:15px">
            <div class="stat-card-num">AES-256</div>
            <div class="stat-card-label">Shared Security</div>
         </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:40px">No</th>
              <th>NPSN</th>
              <th>Nama Sekolah</th>
              <th>Kepala Sekolah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="card" style="margin-top:20px; border-color:var(--cyan)">
         <div class="card-header">
            <div class="card-title">⚙️ KOMPONEN ADMINISTRASI GLOBAL</div>
         </div>
         <div class="card-body">
            <p style="font-size:12px;color:var(--muted);margin-bottom:14px">
               Admin Super mengelola template dokumen dan kategori global yang tersedia untuk semua institusi. 
               Isolasi data tetap berlaku per <code>school_id</code> pada level dokumen pengguna.
            </p>
            <div style="display:flex;gap:10px">
               <button class="btn btn-ghost" onclick="showPage('konten')">📁 Kelola Template Dokumen</button>
               <button class="btn btn-ghost" onclick="seedKategoriDefault()">↩ Pulihkan Kategori Default</button>
            </div>
         </div>
      </div>
    `;
  }
};
