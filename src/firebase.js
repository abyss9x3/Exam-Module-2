// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNfvC6-NG6kz4uVpkBj1Bi3y1s23RT9lo",
  authDomain: "login-signup-47304.firebaseapp.com",
  projectId: "login-signup-47304",
  storageBucket: "login-signup-47304.appspot.com",
  messagingSenderId: "253529374518",
  appId: "1:253529374518:web:72ab07898aee7ae10b3d97",
  measurementId: "G-83F7H7E7KL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
