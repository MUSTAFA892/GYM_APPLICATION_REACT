import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCEubn2-oM8INN36zUaBJ45oZbHYGrl7M",
  authDomain: "gymapp-9eb13.firebaseapp.com",
  projectId: "gymapp-9eb13",
  storageBucket: "gymapp-9eb13.firebasestorage.app",
  messagingSenderId: "489786977458",
  appId: "1:489786977458:web:e4d45d51afce1aa3e42dab",
  measurementId: "G-DW99CFCWTT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com"); // Add Apple provider

export { auth, googleProvider, appleProvider, signInWithPopup };
