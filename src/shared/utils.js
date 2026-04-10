/**
 * CIMEGA SMART OFFICE - Shared Utilities
 * 
 * General helper functions for the application
 */

window.CimegaUtils = {
  /**
   * Mengubah angka menjadi format Rupiah tanpa desimal
   * Menggunakan Math.round() untuk menghindari floating point error
   * @param {number} num 
   * @returns {string} 
   */
  formatIDR: function(num) {
    if (!num || isNaN(num)) return 'Rp 0';
    const rounded = Math.round(Number(num));
    return 'Rp ' + rounded.toLocaleString('id-ID');
  },

  /**
   * Mengubah angka menjadi teks terbilang bahasa Indonesia
   * @param {number} num 
   * @returns {string} 
   */
  terbilang: function(num) {
    if (num === null || isNaN(num)) return '';
    num = Math.round(Math.abs(num));
    if (num === 0) return 'nol';
    
    const angka = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    let result = '';

    if (num < 12) {
      result = ' ' + angka[num];
    } else if (num < 20) {
      result = this.terbilang(num - 10) + ' belas';
    } else if (num < 100) {
      result = this.terbilang(Math.floor(num / 10)) + ' puluh' + this.terbilang(num % 10);
    } else if (num < 200) {
      result = ' seratus' + this.terbilang(num - 100);
    } else if (num < 1000) {
      result = this.terbilang(Math.floor(num / 100)) + ' ratus' + this.terbilang(num % 100);
    } else if (num < 2000) {
      result = ' seribu' + this.terbilang(num - 1000);
    } else if (num < 1000000) {
      result = this.terbilang(Math.floor(num / 1000)) + ' ribu' + this.terbilang(num % 1000);
    } else if (num < 1000000000) {
      result = this.terbilang(Math.floor(num / 1000000)) + ' juta' + this.terbilang(num % 1000000);
    } else if (num < 1000000000000) {
      result = this.terbilang(Math.floor(num / 1000000000)) + ' miliar' + this.terbilang(num % 1000000000);
    }

    return result.trim();
  },

  /**
   * Format JS Date timestamp to 'DD/MM/YYYY' or 'YYYY-MM-DD'
   * @param {Date|any} datePayload 
   */
  formatDate: function(datePayload) {
    if (!datePayload) return '';
    const d = datePayload.toDate ? datePayload.toDate() : new Date(datePayload);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

// Global Aliases for backwards compatibility
window.formatIDR = window.CimegaUtils.formatIDR;
window.angkaTerbilang = window.CimegaUtils.terbilang;
window.formatDate = window.CimegaUtils.formatDate;
window.terbilang = window.CimegaUtils.terbilang;
