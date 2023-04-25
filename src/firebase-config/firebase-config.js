// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAc6TrHOuCdMIDw7nsv4uDCfSAm7-GkME",
  authDomain: "bugtracker-d136e.firebaseapp.com",
  projectId: "bugtracker-d136e",
  storageBucket: "bugtracker-d136e.appspot.com",
  messagingSenderId: "450163275310",
  appId: "1:450163275310:web:796239e06134d4dcf5d1bf",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
