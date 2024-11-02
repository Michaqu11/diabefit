// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig/firebaseConfig.ts";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// setPersistence(auth, 'LOCAL')
//   .then(() => {
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   })
