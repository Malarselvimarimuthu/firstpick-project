import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import app from "../../firebase/firebaseConfig";
import logo from "../../assets/images/cart.jpg";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false); // Flag for verification status
  const navigate = useNavigate(); // Initialize navigate

  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    if (password !== reEnterPassword) {
      setError("Passwords do not match!");
      return;
    }

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      setSuccessMessage("Sign-Up successful! A verification email has been sent. Please check your email.");

      // Clear form fields except username
      setEmail("");
      setPassword("");
      setReEnterPassword("");
      setError("");

      // Show the verification code input
      setIsVerified(true); // Prompt for verification code input
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      setError(`Sign-Up failed: ${error.message}`);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      // Apply the action code to verify the email
      await applyActionCode(auth, verificationCode);
      setSuccessMessage("Email successfully verified!");

      // Store user data in Firestore after successful verification
      const user = auth.currentUser;
      if (user) {
        // Save the username and other details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username, // Ensure username is stored
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        // Redirect to login after successful signup and verification
        navigate("/login");

        // Clear username after successful verification
        setUsername("");
      }
    } catch (error: any) {
      console.error("Error verifying code:", error.message);
      setError(`Verification failed: ${error.message}`);
    }
  };

  const handleGoogleSignUp = async () => {
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

      // Redirect to home or dashboard after successful Google sign-in
      navigate("/");
    } catch (error: any) {
      console.error("Error signing up with Google:", error.message);
      setError(`Google Sign-In failed: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row mt-10">
      {/* Left side with image */}
      <div className="w-full md:w-1/2 bg-cover bg-center flex justify-center items-center">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-md rounded-lg p-8">
        <div className="w-full max-w-md">
          <h1 className="text-[40px] text-gray-800">Create an Account</h1>
          <h4 className="text-gray-800 text-[20px]">Enter your details below</h4>
          <br />

          {/* Sign-Up Form */}
          {!isVerified ? (
            <form onSubmit={handleManualSignUp} className="mb-4">
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
              <div className="mb-4">
                <label className="block text-gray-700">Re-enter Password</label>
                <input
                  type="password"
                  className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                  value={reEnterPassword}
                  onChange={(e) => setReEnterPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
              >
                Sign Up
              </button>
            </form>
          ) : (
            /* Verification Code Form */
            <form onSubmit={handleVerifyCode} className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-700">Enter Verification Code</label>
                <input
                  type="text"
                  className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
              >
                Verify Code
              </button>
            </form>
          )}

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

          {/* Already have an account link */}
          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-sky-500 hover:text-sky-600">Please Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;










