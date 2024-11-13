import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

document.getElementById('signupWithGoogle').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            window.location.href = "../index.html";
        })
        .catch((error) => {
            console.error("Error during sign up:", error);
        });
});


document.getElementById('emailSignupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed up:", userCredential.user);
        window.location.href = "../index.html"; 
      })
      .catch((error) => {
        console.error("Error during email signup:", error);
      });
  });
