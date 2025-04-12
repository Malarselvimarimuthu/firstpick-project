

import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import app from "../../firebase/firebaseConfig";
import logo from "../../assets/images/cart.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleReEnterPasswordVisibility = () => setShowReEnterPassword(!showReEnterPassword);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== reEnterPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      const db = getFirestore(app);

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("Verification email sent! Please check your inbox.");
      setError(null);

      // Clear form fields
      setEmail("");
      setPassword("");
      setReEnterPassword("");
      setUsername("");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const db = getFirestore(app);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error signing up with Google:", error.message);
      setError(`Google Sign-In failed: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row mt-10">
      {/* Left Side with Image */}
      <div className="w-full md:w-1/2 bg-cover bg-center flex justify-center items-center">
        <img src={logo} alt="Signup" className="w-full h-full object-cover" />
      </div>

      {/* Right Side with Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-md rounded-lg p-8">
        <div className="w-full max-w-md">
          <h1 className="text-[40px] text-gray-800 ">Create an Account</h1>
          <h4 className="text-gray-800 text-[20px] mb-6">Enter your details below</h4>

          {/* Sign-Up Form */}
          <form onSubmit={handleSignup} className="mb-4">
            {error && (
              <div className="text-red-500 mb-4" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="text-green-500 mb-4" role="alert">
                {successMessage}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Username</label>
              <input
                type="text"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">Re-enter Password</label>
              <input
                type={showReEnterPassword ? "text" : "password"}
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                required
              />
              <span
                onClick={toggleReEnterPasswordVisibility}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showReEnterPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Google Sign-Up Button */}
          <div className="text-center my-4">OR</div>
          <button
            className="w-full text-black py-2 px-4 rounded hover:bg-gray-300 transition"
            onClick={handleGoogleSignUp}
          >
            <img
              src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
              alt="Google"
              className="inline-block w-6 h-6 mr-2"
            />
            Continue with Google
          </button>

          {/* Already have an account? */}
          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-sky-500 hover:text-sky-600">
                Please Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;






































