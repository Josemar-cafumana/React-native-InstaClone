// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfEbGAmIimadWD9LHUKcixNlsFCdTUOQs",
  authDomain: "rn-insta-clone-ec00c.firebaseapp.com",
  projectId: "rn-insta-clone-ec00c",
  storageBucket: "rn-insta-clone-ec00c.appspot.com",
  messagingSenderId: "963496075501",
  appId: "1:963496075501:web:0ed9c3510943a529412ce4"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORE = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);


