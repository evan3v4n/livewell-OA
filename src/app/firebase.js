// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQgCzZraJBIJdHP_6h98KkMgjHiWSw3-k",
  authDomain: "livewell-oa.firebaseapp.com",
  projectId: "livewell-oa",
  storageBucket: "livewell-oa.appspot.com",
  messagingSenderId: "837518593087",
  appId: "1:837518593087:web:4a80badd551e14b5383c8a",
  measurementId: "G-47M2ZN8JW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);