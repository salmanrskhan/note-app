// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


import { getFirestore, collection } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCayRBLoLSqaeon4YjXWig7Kg9PfQbcCec",
  authDomain: "react-notes-58b34.firebaseapp.com",
  projectId: "react-notes-58b34",
  storageBucket: "react-notes-58b34.appspot.com",
  messagingSenderId: "445155391748",
  appId: "1:445155391748:web:4977d3c526cd15f426f851"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")