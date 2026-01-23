import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 1. Import Storage

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWl0rSNizjxuXdiUgivrPKeHjW2eowcQQ",
  authDomain: "averra-5872b.firebaseapp.com",
  projectId: "averra-5872b",
  storageBucket: "averra-5872b.firebasestorage.app", // Updated to likely correct bucket URL format
  messagingSenderId: "206423703220",
  appId: "1:206423703220:web:e2e397c069137aa223e1e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // 2. Export Storage