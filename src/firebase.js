import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhCgTS8rNCJgQfW065Nq-ajaFLcuWhyYs",
  authDomain: "online-store-7d2f4.firebaseapp.com",
  projectId: "online-store-7d2f4",
  storageBucket: "online-store-7d2f4.firebasestorage.app",
  messagingSenderId: "460351521053",
  appId: "1:460351521053:web:3d79c3892c398cef6fa1f4",
  measurementId: "G-WP6Z16D5KH"
};

// Ось ці три рядки - найголовніші! Вони запускають Firebase.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);