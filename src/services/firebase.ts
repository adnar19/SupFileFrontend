import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "senhabitat-e062b.firebaseapp.com",
  projectId: "senhabitat-e062b",
  storageBucket: "senhabitat-e062b.firebasestorage.app",
  messagingSenderId: "507642445894",
  appId: "1:507642445894:web:c9d943bd8a8792c85c0a47",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Forcer le choix du compte pour Google et Microsoft
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

microsoftProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Formate le nom du fournisseur pour l'affichage
 * @param {string} providerId - L'identifiant du provider (ex: 'google.com')
 * @returns {string} - Nom formaté (ex: 'Google')
 */
export const formatProviderName = (providerId: string) => {
  const names: Record<string, string> = {
    'google.com': 'Google',
    'microsoft.com': 'Microsoft'
  };
  return names[providerId] || providerId;
};

/**
 * Fonction unique pour gérer la connexion via Google ou Microsoft
 * @param {string} providerName - 'google' ou 'microsoft'
 */
export const handleSignIn = async (providerName: 'google' | 'microsoft') => {
  const provider = providerName === 'google' ? googleProvider : microsoftProvider;
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error(`Erreur lors de la connexion via ${providerName}:`, error);
    throw error;
  }
};
