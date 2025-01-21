import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, getDoc,setDoc  } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import app from "../../firebase/firebaseConfig";
import logo from "../../assets/images/cart.jpg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Login successful! Welcome, " + userData.username);
      }

      navigate("/profile");
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      setError(`Login failed: ${error.message}`);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   const auth = getAuth(app);
  //   const provider = new GoogleAuthProvider();
  //   const db = getFirestore(app);

  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     const userDoc = await getDoc(doc(db, "users", user.uid));
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       localStorage.setItem("user", JSON.stringify(userData));
  //       alert("Login successful! Welcome, " + userData.username);
  //     }

  //     navigate("/profile");
  //   } catch (error: any) {
  //     console.error("Error logging in with Google:", error.message);
  //     setError(`Login failed: ${error.message}`);
  //   }
  // };


  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const db = getFirestore(app);

      // Store user data in Firestore after successful Google sign-in
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Login successful! Welcome, " + userData.username);
      }

      // Redirect to home or dashboard after successful Google sign-in
      navigate("/profile");
    } catch (error: any) {
      console.error("Error signing up with Google:", error.message);
      setError(`Google Sign-In failed: ${error.message}`);
    }
  };











  

  const handleForgotPassword = async () => {
    const auth = getAuth(app);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      alert("Password reset email sent to " + email);
    } catch (error: any) {
      console.error("Error sending reset email:", error.message);
      setError(`Failed to send reset email: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row ">
      <div className="w-full md:w-1/2 bg-cover bg-center flex justify-center items-center">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-md rounded-lg ">
        <div className="w-full max-w-md">
          <h1 className="text-[40px] text-gray-800">Log In</h1>
          <h4 className="text-gray-800 text-[20px]">Enter your details below</h4>
          <br />
          <br />
          <form onSubmit={handleLogin} className="mb-4">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
            >
              Log In
            </button>
          </form>
          <div className="text-center my-4">OR</div>
          <button
            className="w-full text-black py-2 px-4 rounded hover:bg-gray-300 transition"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
              alt="Google"
              className="inline-block w-6 h-6 mr-2"
            />
            Continue with Google
          </button>
          <div className="mt-4 text-center">
            <p>
              Create your account now!{" "}
              <a href="/signup" className="text-sky-500 hover:text-sky-600">
                Please Signup
              </a>
            </p>
            <p className="mt-2">
              <button
                className="text-sky-500 hover:text-sky-600"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </p>
            {resetEmailSent && (
              <p className="text-green-500 mt-2">Check your email to reset your password.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
