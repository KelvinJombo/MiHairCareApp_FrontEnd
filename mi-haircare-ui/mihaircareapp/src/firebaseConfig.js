import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwq2N3PtAsky06ugOPJulBXzYPWVIFKbc",
  authDomain: "mihaircareapp.firebaseapp.com",
  projectId: "mihaircareapp",
  storageBucket: "mihaircareapp.firebasestorage.app",
  messagingSenderId: "862488513013",
  appId: "1:862488513013:web:77be67d1420eb6cd9bf8bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
