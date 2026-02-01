import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const role = localStorage.getItem("role");
if (document.getElementById("role")) {
  document.getElementById("role").value = role;
}
if (document.getElementById("title")) {
  document.getElementById("title").textContent = role === "seller" ? "Seller Registration" : "Buyer Registration";
}

const authForm = document.getElementById("authForm");
if (authForm) {
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mobile = document.getElementById("mobile").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;

    if (!name || !email || !password) {
      errorMsg.textContent = "All fields required";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        mobile: mobile,
        state: state,
        city: city,
        role: role || 'buyer', // Default to buyer if not set
        createdAt: new Date().toISOString()
      });

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error(error);
      errorMsg.textContent = error.message;
    }
  });
}
