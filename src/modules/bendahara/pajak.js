window.ModulPajak = {
  container: null,
  pajakData: [],
  userData: null,

  init: async function() {
    this.container = document.getElementById('modulePajakApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    await this.loadData();
    this.render();
    this.initGrid();
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const schoolId = this.userData.school_id || 'NPSN_MIGRATE';
      
      const q = query(
        collection(db, 'pajak_transaksi'), 
        where('school_id', '==', schoolId), 
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      
      this.pajakData = [];
      snap.forEach(doc => {
        this.pajakData.push({ id: doc.id, ...doc.data() });
      });
    } catch(e) {
      console.error("Gagal memuat histori Pajak:", e);
    }
  },

  render: function() {
    this.container.innerHTML = `
      <div class="grid-2">
        <div class="card" style="border-color:var(--gold);">
          <div class="card-header">
            <div class="card-title">🤖 AI KONSULTAN PAJAK BOSP</div>
          </div>
          <div class="card-body">
            <p style="font-size:11px; color:var(--muted); margin-bottom:14px;">Analisis regulasi pajak DJP terbaru secara otomatis untuk setiap transaksi sekolah.</p>
            <div class="form-group">
              <label class="form-label">Uraian Transaksi</label>
              <textarea class="form-control" id="pjUraian" placeholder="Contoh: Belanja laptop Rp8.500.000 ke Toko ABC (NPWP)" style="height:90px;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Total Bruto (Rp)</label>
              <input type="number" class="form-control" id="pjBruto" placeholder="8500000" />
            </div>
            <button class="btn btn-primary" id="btnGenPajak" onclick="window.ModulPajak.analyzePajak()" style="width:100%; justify-content:center; padding:12px;">🔍 Analisis Pajak (Gemini AI)</button>

            <div id="pjResultBox" style="display:none; margin-top:20px; background:rgba(0,255,136,0.05); border:1px solid var(--success); padding:15px; border-radius:10px;">
              <div style="font-family:'Orbitron',sans-serif; color:var(--success); font-weight:700; font-size:12px; margin-bottom:10px;">✅ HASIL ANALISIS PAJAK</div>
              <div class="grid-2" style="font-size:12px;">
                <div><span style="color:var(--muted)">Jenis:</span> <strong id="resJenisStr" style="color:var(--gold)"></strong></div>
                <div><span style="color:var(--muted)">Rate:</span> <strong id="resRateStr" style="color:var(--text)"></strong></div>
              </div>
              <div class="grid-2" style="font-size:12px; margin-top:10px; padding-top:10px; border-top:1px dashed var(--success);">
                <div><span style="color:var(--muted)">Potongan SSP:</span> <strong id="resPotonganStr" style="color:var(--danger)"></strong></div>
                <div><span style="color:var(--muted)">Netto Rekanan:</span> <strong id="resNettoStr" style="color:var(--cyan)"></strong></div>
              </div>
              <input type="hidden" id="hiddenResJenis" /><input type="hidden" id="hiddenResRate" /><input type="hidden" id="hiddenResPotongan" /><input type="hidden" id="hiddenResNetto" />
              <button class="btn btn-success" style="width:100%; justify-content:center; margin-top:15px;" onclick="window.ModulPajak.savePajak()">Terbitkan Bukti Potong</button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">📜 RIWAYAT POTONGAN SSP</div></div>
          <div class="card-body" id="gridWrapperPajak"></div>
        </div>
      </div>
    `;
  },

  analyzePajak: async function() {
    const uraian = document.getElementById('pjUraian').value.trim();
    const bruto = Math.round(parseFloat(document.getElementById('pjBruto').value) || 0);
    if(!uraian || bruto <= 0) { showToast('warn', 'Perhatian', 'Isi data dengan benar!'); return; }

    const btn = document.getElementById('btnGenPajak');
    btn.disabled = true; btn.innerHTML = '⏳ Menghubungi AI...';
    document.getElementById('pjResultBox').style.display = 'none';

    try {
      const systemPrompt = `Anda adalah Spesialis Pajak BOSP. Tentukan jenis pajak dan rate dalam format JSON. { "taxType": "...", "rate": 0.11 }`;
      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Uraian: ${uraian}. Nominal: ${bruto}` }]
      });

      if(res.error) throw new Error(res.error);
      const text = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      const taxType = parsed.taxType || "Bebas Pajak";
      const rate = parseFloat(parsed.rate) || 0;

      const potongan = Math.round(bruto * rate);
      const netto = bruto - potongan;

      document.getElementById('resJenisStr').innerText = taxType;
      document.getElementById('resRateStr').innerText = (rate * 100).toFixed(2) + '%';
      document.getElementById('resPotonganStr').innerText = window.formatIDR(potongan);
      document.getElementById('resNettoStr').innerText = window.formatIDR(netto);

      document.getElementById('hiddenResJenis').value = taxType;
      document.getElementById('hiddenResRate').value = rate;
      document.getElementById('hiddenResPotongan').value = potongan;
      document.getElementById('hiddenResNetto').value = netto;

      document.getElementById('pjResultBox').style.display = 'block';
    } catch(e) { showToast('error', 'Gagal', e.message); }
    finally { btn.disabled = false; btn.innerHTML = '🔍 Analisis Pajak (Gemini AI)'; }
  },

  savePajak: async function() {
    const data = {
      uraian: document.getElementById('pjUraian').value.trim(),
      bruto: Math.round(parseFloat(document.getElementById('pjBruto').value) || 0),
      jenis_pajak: document.getElementById('hiddenResJenis').value,
      rate: parseFloat(document.getElementById('hiddenResRate').value) || 0,
      potongan: Math.round(parseFloat(document.getElementById('hiddenResPotongan').value) || 0),
      netto: Math.round(parseFloat(document.getElementById('hiddenResNetto').value) || 0),
      sekolah: this.userData.sekolah,
      school_id: this.userData.school_id || 'NPSN_MIGRATE'
    };

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'pajak_transaksi'), { ...data, createdAt: serverTimestamp() });
      showToast('success', 'Berhasil', 'Arsip pajak berhasil disimpan.');
      this.init(); 
    } catch(e) { showToast('error', 'Gagal', e.message); }
  },

  initGrid: function() {
    const data = this.pajakData.map(p => [
      p.uraian || '-', p.jenis_pajak || '-', window.formatIDR(Math.round(p.bruto || 0)), window.formatIDR(Math.round(p.potongan || 0)),
      gridjs.html(`<button class='btn btn-ghost btn-sm' onclick='window.ModulPajak.hapusPajak("${p.id}")'>🗑</button>`)
    ]);

    const wrapper = document.getElementById('gridWrapperPajak');
    wrapper.innerHTML = '';
    new gridjs.Grid({
      columns: ['Transaksi', 'Jenis', 'Bruto', 'Potongan', 'Aksi'],
      data: data, search: true, pagination: { limit: 5 }
    }).render(wrapper);
  },

  hapusPajak: async function(id) {
    if(!confirm("Yakin menghapus catatan ini?")) return;
    try { const { doc, deleteDoc } = window._fb; await deleteDoc(doc(db, 'pajak_transaksi', id)); this.init(); } catch(e) { showToast('error', 'Gagal', e.message); }
  }
};
