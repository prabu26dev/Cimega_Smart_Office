window.ModulPajak = {
  container: null,
  pajakData: [],

  init: async function() {
    this.container = document.getElementById('modulePajakApp');
    await this.loadData();
    this.render();
    this.initGrid();
  },

  loadData: async function() {
    try {
      const { collection, getDocs, query, where, orderBy } = window._fb;
      const q = query(collection(db, 'pajak_transaksi'), where('sekolah', '==', userData.sekolah || ''), orderBy('createdAt', 'desc'));
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
        <!-- AI ASSISTANT PANEL -->
        <div class="card" style="border-color:var(--gold);">
          <div class="card-header">
            <div class="card-title">🤖 AI KONSULTAN PAJAK BOSP</div>
          </div>
          <div class="card-body">
            <p style="font-size:11px; color:var(--muted); margin-bottom:14px;">Masukkan rincian pembelanjaan untuk dianalisis oleh AI. AI akan merekomendasikan jenis pemotongan pajak (PPN, PPh 22, PPh 23, Final) beserta tarif yang tepat sesuai aturan DJP.</p>
            
            <div class="form-group">
              <label class="form-label">Uraian Transaksi Rekanan</label>
              <textarea class="form-control" id="pjUraian" placeholder="Contoh: Belanja laptop Rp8.500.000 ke Toko Komputer ABC (BKP/BerNPWP)" style="height:90px;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Total Belanja Kotor (DPP + Pajak)</label>
              <input type="number" class="form-control" id="pjBruto" placeholder="8500000" />
            </div>

            <button class="btn btn-primary" id="btnGenPajak" onclick="window.ModulPajak.analyzePajak()" style="width:100%; justify-content:center; padding:12px;">🔍 Analisis Pajak (Gemini AI)</button>

            <!-- HASIL AI (DETERMINISTIC JS MATH APPLIED) -->
            <div id="pjResultBox" style="display:none; margin-top:20px; background:rgba(0,255,136,0.05); border:1px solid var(--success); padding:15px; border-radius:10px;">
              <div style="font-family:'Orbitron',sans-serif; color:var(--success); font-weight:700; font-size:12px; margin-bottom:10px;">✅ HASIL EKSTRAKSI AI & PERHITUNGAN JS</div>
              
              <div class="grid-2" style="font-size:12px;">
                <div><span style="color:var(--muted)">Jenis Pajak:</span> <strong id="resJenisStr" style="color:var(--gold)"></strong></div>
                <div><span style="color:var(--muted)">Persentase / Rate:</span> <strong id="resRateStr" style="color:var(--text)"></strong></div>
              </div>
              <div class="grid-2" style="font-size:12px; margin-top:10px; padding-top:10px; border-top:1px dashed var(--success);">
                <div><span style="color:var(--muted)">Potongan Pajak (SSP):</span> <strong id="resPotonganStr" style="color:var(--danger)"></strong></div>
                <div><span style="color:var(--muted)">Sisa Bayar (Netto Rekanan):</span> <strong id="resNettoStr" style="color:var(--cyan)"></strong></div>
              </div>

              <input type="hidden" id="hiddenResJenis" />
              <input type="hidden" id="hiddenResRate" />
              <input type="hidden" id="hiddenResPotongan" />
              <input type="hidden" id="hiddenResNetto" />

              <button class="btn btn-success" style="width:100%; justify-content:center; margin-top:15px;" onclick="window.ModulPajak.savePajak()">Terbitkan Bukti Potong (Simpan)</button>
            </div>
          </div>
        </div>

        <!-- RIWAYAT SSP -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📜 RIWAYAT POTONGAN PAJAK (SSP)</div>
          </div>
          <div class="card-body">
            <div id="gridWrapperPajak"></div>
          </div>
        </div>
      </div>
    `;
  },

  analyzePajak: async function() {
    const uraian = document.getElementById('pjUraian').value.trim();
    // Parse to exact int
    const bruto = Math.round(parseFloat(document.getElementById('pjBruto').value) || 0);

    if(!uraian || bruto <= 0) {
      alert("Isi uraian dan nominal bruto belanja!");
      return;
    }

    const btn = document.getElementById('btnGenPajak');
    btn.disabled = true;
    btn.innerHTML = '⏳ Menghubungi DJP AI...';
    document.getElementById('pjResultBox').style.display = 'none';

    try {
      const systemPrompt = `Anda adalah Spesialis Pajak Bendahara BOSP Sekolah.
TUGAS: Analisis narasi belanja dan tentukan HANYA jenis pajak dan persentase tarifnya menurut regulasi pajak DJP terbaru di Indonesia (misal PPN 11%, PPh 22 = 1.5%, PPh 23 = 2%).
PENTING: Jangan lakukan komputasi matematika IDR. Jangan jelaskan apapun.
KEMBALIKAN: Murni format struktur JSON yang berisi property:
{
  "taxType": "nama_pajak" (contoh: "PPN & PPh 22", "PPh 23", "Bebas Pajak"),
  "rate": decimal_number (gabungan tarif total untuk potongan uang muka. contoh: 0.11 jika 11%, 0.125 jika kombinasi 11%+1.5%, atau 0.0 jika bebas pajak)
}`;

      const res = await window.CimegaAI.ask({
        system: systemPrompt,
        messages: [{ role: 'user', content: `Uraian: ${uraian}. Nominal: ${bruto}` }],
        maxTokens: 500
      });

      if(res.error) throw new Error(res.error);

      // Extract JSON from AI text
      let jsonString = res.text;
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      if(jsonStart !== -1 && jsonEnd !== -1) {
        jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      }
      
      const parsed = JSON.parse(jsonString);
      const taxType = parsed.taxType || "Tidak Diketahui";
      const rate = parseFloat(parsed.rate) || 0.0;

      // ==========================================
      // DETERMINISTIC JAVASCRIPT MATH (FALLBACK)
      // ==========================================
      // Calculate strict Integers ensuring IDR accuracy
      const potongan = Math.round(bruto * rate);
      const netto = bruto - potongan;

      // Update UI
      document.getElementById('resJenisStr').innerText = taxType;
      document.getElementById('resRateStr').innerText = (rate * 100).toFixed(2) + '%';
      document.getElementById('resPotonganStr').innerText = window.formatIDR(potongan);
      document.getElementById('resNettoStr').innerText = window.formatIDR(netto);

      // Hidden inputs for saving
      document.getElementById('hiddenResJenis').value = taxType;
      document.getElementById('hiddenResRate').value = rate;
      document.getElementById('hiddenResPotongan').value = potongan;
      document.getElementById('hiddenResNetto').value = netto;

      document.getElementById('pjResultBox').style.display = 'block';

    } catch(e) {
      alert("Gagal menganalisis. AI Error: " + e.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '🔍 Analisis Pajak (Gemini AI)';
    }
  },

  savePajak: async function() {
    const data = {
      uraian: document.getElementById('pjUraian').value.trim(),
      bruto: Math.round(parseFloat(document.getElementById('pjBruto').value) || 0),
      jenis_pajak: document.getElementById('hiddenResJenis').value,
      rate: parseFloat(document.getElementById('hiddenResRate').value) || 0,
      potongan: Math.round(parseFloat(document.getElementById('hiddenResPotongan').value) || 0),
      netto: Math.round(parseFloat(document.getElementById('hiddenResNetto').value) || 0),
      sekolah: userData.sekolah
    };

    if(data.bruto <= 0) return alert("Nominal invalid!");

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      await addDoc(collection(db, 'pajak_transaksi'), { ...data, createdAt: serverTimestamp() });
      
      document.getElementById('pjUraian').value = '';
      document.getElementById('pjBruto').value = '';
      document.getElementById('pjResultBox').style.display = 'none';
      alert("Bukti potongan pajak berhasil diarsipkan!");
      
      this.init(); // Reload
    } catch(e) {
      alert("Gagal simpan pajak: " + e.message);
    }
  },

  initGrid: function() {
    const data = this.pajakData.map((p, idx) => [
      p.uraian || '-',
      p.jenis_pajak || '-',
      window.formatIDR(Math.round(p.bruto || 0)),
      window.formatIDR(Math.round(p.potongan || 0)),
      gridjs.html(\`<button class='btn btn-ghost btn-sm' onclick='window.ModulPajak.hapusPajak("\${p.id}")'>Batalkan</button>\`)
    ]);

    const wrapper = document.getElementById('gridWrapperPajak');
    wrapper.innerHTML = '';
    
    new gridjs.Grid({
      columns: ['Transaksi', 'Jenis Pajak', 'Bruto', 'Potongan', 'Aksi'],
      data: data,
      search: true,
      pagination: { limit: 5 },
      language: { search: { placeholder: 'Cari SSP...' } }
    }).render(wrapper);
  },

  hapusPajak: async function(id) {
    if(!confirm("Yakin menghapus catatan potongan ini?")) return;
    try { const { doc, deleteDoc } = window._fb; await deleteDoc(doc(db, 'pajak_transaksi', id)); this.init(); } catch(e) { alert(e.message); }
  }
};
