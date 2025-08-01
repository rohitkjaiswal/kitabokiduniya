import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore Database
import { getStorage } from "firebase/storage"; // Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyCNB-WsqZK9Sjuy_tjUd5owB-YejeeVjaw",
    authDomain: "kittabehai.firebaseapp.com",
    projectId: "kittabehai",
    storageBucket: "kittabehai.appspot.com", // Corrected Storage Bucket
    messagingSenderId: "583644222102",
    appId: "1:583644222102:web:ff153e05eaa2622da528b7",
    measurementId: "G-EBDF6LWW0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Storage

export { auth, db, storage };