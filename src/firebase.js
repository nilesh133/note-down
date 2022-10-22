import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCTe4utAxFfsYs2qXrTltc0FWGhpwb9Ygo",
    authDomain: "notes-app-project-21b39.firebaseapp.com",
    projectId: "notes-app-project-21b39",
    storageBucket: "notes-app-project-21b39.appspot.com",
    messagingSenderId: "543827396101",
    appId: "1:543827396101:web:493822e6218644889bbe6c"
  };

  const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  const modular_firebase_app=initializeApp(firebaseConfig)
  
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  
  const provider = new firebase.auth.GoogleAuthProvider();
  const storage = firebase.storage();
  
  export const modular_storage=getStorage(modular_firebase_app)
  export { auth, provider, storage, db,firebase };