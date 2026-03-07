import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "senhabitat-e062b.firebaseapp.com",
  projectId: "senhabitat-e062b",
  storageBucket: "senhabitat-e062b.firebasestorage.app",
  messagingSenderId: "507642445894",
  appId: "1:507642445894:web:c9d943bd8a8792c85c0a47",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
