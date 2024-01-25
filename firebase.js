import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

export { firebase, db }

