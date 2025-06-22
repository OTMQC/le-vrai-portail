import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAG14_2FT4EChamlilvCbjxHyKadvpDfgk",
  authDomain: "portail-artiste-otmqc.firebaseapp.com",
  projectId: "portail-artiste-otmqc",
  storageBucket: "otmqc-docs-storage.appspot.com",
  messagingSenderId: "755801581824",
  appId: "1:755801581824:web:5f83315cce61508752ebe5",
  measurementId: "G-SZC934CRSR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
