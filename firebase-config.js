import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdKt3gpW556sKTFcs2rcFV-YZOW0tvoP4",
  authDomain: "streamly-d3ea4.firebaseapp.com",
  projectId: "streamly-d3ea4",
  storageBucket: "streamly-d3ea4.firebasestorage.app",
  messagingSenderId: "425019080684",
  appId: "1:425019080684:web:af145c87eb027d72e7cac9",
  measurementId: "G-PRZ6BZP088"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
