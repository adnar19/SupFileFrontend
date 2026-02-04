//Installer d'abord le package via npm install firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import .meta.env

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: "senhabitat-e062b.firebaseapp.com",
  projectId: "senhabitat-e062b",
  storageBucket: "senhabitat-e062b.firebasestorage.app",
  messagingSenderId: "507642445894",
  appId: "1:507642445894:web:c9d943bd8a8792c85c0a47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);