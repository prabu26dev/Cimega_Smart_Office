// ── CIMEGA SMART OFFICE: KNOWLEDGE SERVICE ──────────────────────────
// Lokasi: src/shared/knowledge_service.js

window.CimegaKnowledge = {
    knowledge: [],

    init: async function() {
        try {
            const { collection, getDocs, query, where } = window._fb;
            const db = window._fb.db;
            const userData = JSON.parse(localStorage.getItem('cimega_user') || '{}');
            
            if (!db || !userData.sekolah) return;

            // Ambil pengetahuan khusus sekolah (Visi, Misi, Aturan Internal)
            const q = query(collection(db, 'knowledge_base'), where('sekolah', '==', userData.sekolah));
            const snap = await getDocs(q);
            
            this.knowledge = [];
            snap.forEach(doc => {
                this.knowledge.push(doc.data().content);
            });

            console.log(`✅ Knowledge Service: Memuat ${this.knowledge.length} basis pengetahuan sekolah.`);
        } catch (e) {
            console.warn('Knowledge Service Error:', e);
        }
    },

    getKnowledgeString: function() {
        if (this.knowledge.length === 0) return "";
        return `\n### BASIS PENGETAHUAN SEKOLAH (INTERNAL) ###\n${this.knowledge.map(k => `- ${k}`).join('\n')}\n`;
    }
};

// Auto-init
window.CimegaKnowledge.init();
