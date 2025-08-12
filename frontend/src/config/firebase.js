// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRc9kAE7emDKY8HoyFfY_DDSbWuhJGamE",
  authDomain: "canteen-portal-8feba.firebaseapp.com",
  projectId: "canteen-portal-8feba",
  storageBucket: "canteen-portal-8feba.firebasestorage.app",
  messagingSenderId: "727876346424",
  appId: "1:727876346424:web:5f59a953b7ed8d3efbfccd",
  measurementId: "G-1RRJWDSPK8"
};

// Initialize Firebase
import { getFirestore } from "firebase/firestore";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);