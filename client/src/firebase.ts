import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD-l8UzlvFL_zu-yq9Zsr0ZytItuCBbK4Y",
  authDomain: "oasisprotocol-73c36.firebaseapp.com",
  projectId: "oasisprotocol-73c36",
  storageBucket: "oasisprotocol-73c36.firebasestorage.app",
  messagingSenderId: "750905895553",
  appId: "1:750905895553:web:edbb9b3a99a7592c297b80",
  measurementId: "G-H4DZ0WNCP3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;