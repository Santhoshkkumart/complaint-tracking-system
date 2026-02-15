import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   // for login/auth
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmFFg3AyKtFTiPP9uRUxSKkaEv0_hlVaA",
  authDomain: "complaint-tracking-syste-d7788.firebaseapp.com",
  projectId: "complaint-tracking-syste-d7788",
  storageBucket: "complaint-tracking-syste-d7788.firebasestorage.app",
  messagingSenderId: "902273410748",
  appId: "1:902273410748:web:6b3b32d90e9e09aefe92b9",
  measurementId: "G-K2GC075ES8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);