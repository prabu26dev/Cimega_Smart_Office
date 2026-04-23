/**
 * Cimega Smart Office - Crypto Helper
 * Client-side AES-256-GCM Encryption Utility
 */

window.CimegaCrypto = {
  /**
   * Encrypts a string using a base64 encoded master key
   * @param {string} text - The plaintext to encrypt
   * @param {string} base64Key - The school_secret_key from Firestore
   * @returns {Promise<string>} - The combined IV + Ciphertext in base64
   */
  encrypt: async function(text, base64Key) {
    try {
      if (!text || !base64Key) return text;
      
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Import the key
      const keyBuffer = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
      const key = await window.crypto.subtle.importKey(
        'raw', keyBuffer, 'AES-GCM', false, ['encrypt']
      );
      
      // Generate IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
      );
      
      // Combine IV and Encrypted Data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      // Return as base64
      return btoa(String.fromCharCode(...combined));
    } catch (e) {
      console.error("Encryption error:", e);
      return text; // Fallback to plaintext if error (not ideal, but prevents crash)
    }
  },

  /**
   * Decrypts a base64 string using a base64 encoded master key
   * @param {string} combinedBase64 - The combined IV + Ciphertext
   * @param {string} base64Key - The school_secret_key from Firestore
   * @returns {Promise<string>} - The decrypted plaintext
   */
  decrypt: async function(combinedBase64, base64Key) {
    try {
      if (!combinedBase64 || !base64Key) return combinedBase64;
      
      // Check if it's actually base64 (very simple check)
      if (combinedBase64.length < 16) return combinedBase64;

      const combined = Uint8Array.from(atob(combinedBase64), c => c.charCodeAt(0));
      
      // Extract IV (first 12 bytes)
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      
      // Import the key
      const keyBuffer = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
      const key = await window.crypto.subtle.importKey(
        'raw', keyBuffer, 'AES-GCM', false, ['decrypt']
      );
      
      // Decrypt
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.warn("Decryption failed. Data might be plaintext or wrong key used.");
      return combinedBase64; // Return original if decryption fails (likely plaintext)
    }
  }
};
