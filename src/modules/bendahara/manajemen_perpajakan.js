window.BendaharaModules = window.BendaharaModules || {};

window.BendaharaModules['manajemen_perpajakan'] = {
  id: 'manajemen_perpajakan',
  title: 'Manajemen Pajak & Setoran',
  icon: '🏛️',
  desc: 'Sub-buku pemotongan PPN, PPh 21/22/23, Pajak Daerah, dan arsip validasi NTPN penyetoran kas negara.',
  items: [
    {
      id: 'buku_pembantu_pajak',
      nama: 'Buku Pembantu Pajak (Sub-Ledger)',
      icon: '📊',
      components: [
        { id: 'uraian_pajak', label: 'Tgl & Uraian Transaksi Dasar (DPP)', type: 'textarea' },
        { id: 'pungutan_pajak', label: 'Jenis Pajak & Nominal Dipotong (PPN/PPh 21/22/23)', type: 'textarea' },
        { id: 'saldo_setoran', label: 'Tgl Penyetoran & Saldo Pajak Terhutang', type: 'textarea' }
      ],
      ai_prompt: "Sebagai Pegawai Pajak Fiskal (AR/Account Representative), validasi logistik Buku Pembantu Pajak ini dari kesalahan input.\n\nTugas Pengawasan: \n1. Tinjau nilai Dasar Pengenaan Pajak (DPP) sesuai kronologi log mutasi pajak: {{uraian_pajak}}.\n2. Kategorikan log pungutan ini dalam kompartemen pajaknya (PPh vs PPN vs PBJT): {{pungutan_pajak}}.\n3. Laporkan mutasi ini menjadi neraca keseimbangan setoran negara, soroti jika masih ada utang pungutan pajak hari ini yang masih berada di tangan Bendahara alias belum disetor ke Bank: {{saldo_setoran}}."
    },
    {
      id: 'bukti_setor_pajak',
      nama: 'Bukti Setor Pajak (BPN/SSP)',
      icon: '🖨️',
      components: [
        { id: 'dokumen_ebilling', label: 'ID e-Billing DJP & KJS (Kode Jenis Setoran)', type: 'textarea' },
        { id: 'ntpn_bank', label: 'Nominal & Bukti Sah NTPN dari Mutasi Bank', type: 'textarea' }
      ],
      ai_prompt: "Anda adalah Pemeriksa Surat Setoran Pajak (SSP). Kompilasikan bukti otentik setoran negara agar SPJ sah.\n\nInstruksi Arsip: \n1. Integrasikan identitas e-billing dan kode MAP pajak dari inputan ini: {{dokumen_ebilling}}.\n2. Verifikasi/tulis ulang kode alphanumerik transaksi NTPN penyetoran mutlak (non-refundable tax transfer rate) berdasar bukti bayar lunas: {{ntpn_bank}} untuk dilekatkan pada lembar pajak faktur sekolah."
    }
  ]
};
