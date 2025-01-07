import { getAuth } from "firebase/auth";
import { initializeApp, getApps } from 'firebase/app';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDybADnrf6sqfrhzMRHV5O584jk1Re8ivc",
  authDomain: "famzone-27d61.firebaseapp.com",
  projectId: "famzone-27d61",
  storageBucket: "famzone-27d61.appspot.com",
  messagingSenderId: "33376493161",
  appId: "1:33376493161:web:d084d0b59a4b1e95194cf8"
};

// Initialisation Firebase (Évite de doubler l'initialisation)
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
