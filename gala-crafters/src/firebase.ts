// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFP3doPunnuqg7SQNEDQfe8Brea34bc0w",
  authDomain: "crm-gala-crafters.firebaseapp.com",
  projectId: "crm-gala-crafters",
  storageBucket: "crm-gala-crafters.firebasestorage.app",
  messagingSenderId: "869641699128",
  appId: "1:869641699128:web:189812a0c681bf5dfc8bcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
};

export default app;
