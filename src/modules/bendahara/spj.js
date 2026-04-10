window.ModulSpj = {
  container: null,
  userData: null,

  init: function() {
    this.container = document.getElementById('moduleSpjApp');
    this.userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
    this.render();
  },

  terbilang: function(angka) {
    var bilangan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    angka = Math.round(Number(angka));
    if (angka < 12) return bilangan[angka];
    if (angka < 20) return bilangan[angka - 10] + " Belas";
    if (angka < 100) return bilangan[Math.floor(angka / 10)] + " Puluh " + bilangan[angka % 10];
    if (angka < 200) return "Seratus " + this.terbilang(angka - 100);
    if (angka < 1000) return bilangan[Math.floor(angka / 100)] + " Ratus " + this.terbilang(angka % 100);
    if (angka < 2000) return "Seribu " + this.terbilang(angka - 1000);
    if (angka < 1000000) return this.terbilang(Math.floor(angka / 1000)) + " Ribu " + this.terbilang(angka % 1000);
    if (angka < 1000000000) return this.terbilang(Math.floor(angka / 1000000)) + " Juta " + this.terbilang(angka % 1000000);
    if (angka < 1000000000000) return this.terbilang(Math.floor(angka / 1000000000)) + " Milyar " + this.terbilang(angka % 1000000000);
    return "Angka terlalu besar";
  },

  render: function() {
    this.container.innerHTML = `
      <div class="card" style="border-color:var(--gold);">
        <div class="card-header">
          <div class="card-title">🧾 E-PRINT KWITANSI BOSP (SPJ)</div>
        </div>
        <div class="card-body">
          <p style="font-size:11px; color:var(--muted); margin-bottom:15px;">Generate kwitansi resmi yang dicetak di kertas A4. Dokumen akan otomatis diajukan pengesahan (TTE) ke Kepala Sekolah.</p>
          
          <div class="grid-2">
             <div class="form-group"><label class="form-label">Telah Terima Dari</label><input class="form-control" id="kwiDari" placeholder="Bendahara BOS SD..." /></div>
             <div class="form-group"><label class="form-label">Nomor Kwitansi</label><input class="form-control" id="kwiNo" placeholder="No. BKU / Tanggal" /></div>
          </div>
          
          <div class="form-group"><label class="form-label">Untuk Pembayaran (Uraian)</label><textarea class="form-control" id="kwiUraian" placeholder="Pembelian Alat Tulis Kantor..."></textarea></div>
          
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Nominal Angka (Rp)</label><input class="form-control" type="number" id="kwiNominal" oninput="window.ModulSpj.updateTerbilang()" placeholder="1500000" /></div>
            <div class="form-group"><label class="form-label">Nominal Terbilang (Otomatis)</label><textarea class="form-control" id="kwiTerbilang" readonly style="background:rgba(255,208,0,0.02); color:var(--gold); border-style:dashed;"></textarea></div>
          </div>
          
          <div class="grid-2">
             <div class="form-group"><label class="form-label">Tanggal Cetak</label><input type="date" class="form-control" id="kwiTgl" /></div>
             <div class="form-group"><label class="form-label">Nama Penerima/Rekanan</label><input class="form-control" id="kwiPenerima" placeholder="Toko Abadi / Nama Guru" /></div>
          </div>

          <button class="btn btn-success" style="width:100%; justify-content:center; padding:12px; margin-top:10px; font-size:14px;" onclick="window.ModulSpj.generatePrint()">🖨️ Cetak & Ajukan Pengesahan (PDF)</button>
        </div>
      </div>

      <div id="printableSpj" style="display:none;"></div>
    `;
    document.getElementById('kwiTgl').value = new Date().toISOString().split('T')[0];
  },

  updateTerbilang: function() {
    const isi = document.getElementById('kwiNominal').value;
    const nominal = Math.round(Number(isi) || 0);
    const teks = this.terbilang(nominal).trim();
    document.getElementById('kwiTerbilang').value = teks ? teks + " Rupiah" : "";
  },

  generatePrint: async function() {
    const dr = document.getElementById('kwiDari').value || "Bendahara Sekolah";
    const no = document.getElementById('kwiNo').value || "-";
    const uraian = document.getElementById('kwiUraian').value || "-";
    const nominalRaw = Math.round(Number(document.getElementById('kwiNominal').value) || 0);
    const terbilangStr = document.getElementById('kwiTerbilang').value || "-";
    const tgl = document.getElementById('kwiTgl').value;
    const penerima = document.getElementById('kwiPenerima').value || ".............................";
    
    if(nominalRaw <= 0) { showToast('warn', 'Perhatian', 'Masukkan nominal wajar!'); return; }

    try {
      const { collection, addDoc, serverTimestamp } = window._fb;
      const schoolId = this.userData.school_id || 'NPSN_MIGRATE';

      // Phase 5: Automatically add to Kepsek Approval queue
      await addDoc(collection(db, 'antrean_dokumen'), {
        tipe: 'SPJ',
        judul: `No: ${no} - ${uraian}`,
        pemohon: this.userData.nama,
        school_id: schoolId,
        status: 'waiting_approval',
        createdAt: serverTimestamp()
      });

      showToast('success', 'Berhasil', 'Kwitansi dicetak dan diajukan pengesahan.');

      const rp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(nominalRaw);
      const pr = document.getElementById('printableSpj');
      
      pr.innerHTML = `
        <div style="border: 2px solid #000; padding: 30px; font-family: 'Times New Roman', Times, serif; color:#000; max-width:800px; margin:0 auto; background:#fff;">
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px; text-transform: uppercase;">KWITANSI BUKTI PEMBAYARAN</h2>
            <div style="font-size: 14px;">Nomor: ${no}</div>
          </div>

          <table style="width: 100%; font-size: 16px; margin-bottom:20px; border-spacing:0 15px;">
            <tr><td style="width: 25%; font-weight: bold; vertical-align:top;">Telah Terima Dari</td><td style="width: 3%;">:</td><td>${dr}</td></tr>
            <tr><td style="font-weight: bold; vertical-align:top;">Uang Sebanyak</td><td>:</td><td style="font-style:italic; border:1px dashed #999; padding:10px; background:#f9f9f9;">${terbilangStr}</td></tr>
            <tr><td style="font-weight: bold; vertical-align:top;">Guna Membayar</td><td>:</td><td>${uraian}</td></tr>
          </table>

          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top: 40px;">
            <div style="border: 2px solid #000; padding: 15px 30px; font-size: 24px; font-weight: bold; background:#f0f0f0;">${rp}</div>
            <div style="text-align: center; font-size: 16px; width:250px;">
              <p style="margin-bottom: 80px;">............, ${tgl}</p>
              <p style="margin: 0; text-decoration: underline; font-weight: bold;">${penerima}</p>
              <p style="margin: 0;">Penerima</p>
            </div>
          </div>
        </div>
      `;

      window.print();
    } catch (e) {
      showToast('error', 'Gagal', e.message);
    }
  }
};
