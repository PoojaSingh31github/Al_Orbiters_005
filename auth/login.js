import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
 GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyC3FQs-UlTr4q0Ts9-5pT3yCPkCHFUp7So",
    authDomain: "visualogic-cea14.firebaseapp.com",
    projectId: "visualogic-cea14",
    storageBucket: "visualogic-cea14.firebasestorage.app",
    messagingSenderId: "233386618564",
    appId: "1:233386618564:web:2103d9273fa2b0d9192391",
    measurementId: "G-8GVZRM6P1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Login with Google
document.getElementById('loginWithGoogle').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // On successful login, redirect to dashboard
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error during login:", error);
        });
});


// Sign In with Email and Password
document.getElementById('emailSigninForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed in:", userCredential.user);
        window.location.href = "index.html"; // Redirect to dashboard
      })
      .catch((error) => {
        console.error("Error during email signin:", error);
      });
  });
