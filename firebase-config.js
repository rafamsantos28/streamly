import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkYudiGSZxhsiMj4MoLAMCLRErb9IlTDE",
  authDomain: "streamly-87883.firebaseapp.com",
  projectId: "streamly-87883",
  storageBucket: "streamly-87883.firebasestorage.app",
  messagingSenderId: "553778506908",
  appId: "1:553778506908:web:bf4cc80e128038a3df9159",
  measurementId: "G-DBL12V65JS"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
