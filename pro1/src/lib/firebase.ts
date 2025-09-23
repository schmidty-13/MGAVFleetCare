
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.DATABASE_API_KEY,
  authDomain: "mgavvvv.firebaseapp.com",
  projectId: "mgavvvv",
  storageBucket: "mgavvvv.firebasestorage.app",
  messagingSenderId: "886317681413",
  appId: "1:886317681413:web:834f598a13a78a3e30456c",
  measurementId: "G-43E8X2ELYS"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
