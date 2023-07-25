import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlMXnTIhkxuMsGYkwepssf3cIjhFO5NjA",
  authDomain: "threads-18b4b.firebaseapp.com",
  projectId: "threads-18b4b",
  storageBucket: "threads-18b4b.appspot.com",
  messagingSenderId: "718045820063",
  appId: "1:718045820063:web:e3db3a899823a8567d1eaa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
