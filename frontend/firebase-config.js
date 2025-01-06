// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFvujebTVphL0I1bejYxAjiDvCiUcTlvg",
  authDomain: "pet-connecting.firebaseapp.com",
  projectId: "pet-connecting",
  storageBucket: "pet-connecting.firebasestorage.app",
  messagingSenderId: "376105723541",
  appId: "1:376105723541:web:8316632380977a2399dd9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging, getToken, onMessage };