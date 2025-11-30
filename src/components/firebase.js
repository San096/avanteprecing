// Importando Firebase
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEro0P7N1oYNCiC8Y8NhEtcu7QyKoshmI",
  authDomain: "inovaleprecing.firebaseapp.com",
  projectId: "inovaleprecing",
  storageBucket: "inovaleprecing.firebasestorage.app",
  messagingSenderId: "439207109276",
  appId: "1:439207109276:web:340bd4c11f2f07f1704359",
  measurementId: "G-37Z9VWGXDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
