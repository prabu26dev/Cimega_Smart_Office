// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRF7ltSwp_QO3fDhtpCLw2YEXnYAaAD7w",
  authDomain: "cimega-smart-office.firebaseapp.com",
  projectId: "cimega-smart-office",
  storageBucket: "cimega-smart-office.firebasestorage.app",
  messagingSenderId: "575372777252",
  appId: "1:575372777252:web:8b4e2ec4815bd4fe7385b1",
  measurementId: "G-9ESNXDL7C4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export semua layanan yang akan dipakai
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;