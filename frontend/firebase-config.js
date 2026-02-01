// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEhI7nizm_-QtTSMPyQAiDgcIU1rUqXJg",
    authDomain: "localmart-b7fc1.firebaseapp.com",
    projectId: "localmart-b7fc1",
    storageBucket: "localmart-b7fc1.firebasestorage.app",
    messagingSenderId: "741692329501",
    appId: "1:741692329501:web:06812e8122d620a7d400f4",
    measurementId: "G-R1JZS3NMHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };
