// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAp3-ZdW0m6D2ltgO1KVMGAbC_-3nMCCu4",
    authDomain: "neodex-5ca12.firebaseapp.com",
    projectId: "neodex-5ca12",
    storageBucket: "neodex-5ca12.firebasestorage.app",
    messagingSenderId: "1049788928177",
    appId: "1:1049788928177:web:9484d6dac808191e61d290",
    measurementId: "G-Q4599EP824"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Autenticação
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

export { auth, provider, db };
export default app;
