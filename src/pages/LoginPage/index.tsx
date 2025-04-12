import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/cart.jpg";
import  app  from "../../firebase/firebaseConfig";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const navigate = useNavigate();

  const auth = getAuth(app);
  const db = getFirestore(app);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user.emailVerified) {
        // Fetch additional user data from your database
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Implement `fetchUserData` function
        setMessage("Login successful!");
        if (userDoc.exists()) {
          const userData = userDoc.data();
          localStorage.setItem("user", JSON.stringify(userData));
          alert("Login successful! Welcome, " + userData.username);
          navigate("/");
        }
      } else {
        setMessage("Please verify your email before logging in.");
      }
    } catch (error: any) {
      setError("Invalid email or password. Please try again.");
    }
  };
  

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Login successful! Welcome, " + userData.username);
        navigate("/profile");
      }
    } catch (error: any) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      alert("Password reset email sent to " + email);
    } catch (error: any) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 bg-cover bg-center flex justify-center items-center">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-md rounded-lg">
        <div className="w-full max-w-md px-4">
          <h1 className="text-4xl text-gray-800  mb-2">Log In</h1>
          <p className="text-gray-800 text-lg mb-6">Enter your details below</p>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {message && <div className="text-green-500 mb-4">{message}</div>}

          <form onSubmit={handleLogin} className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className={`w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500 ${
                  !isEmailValid && "border-red-500"
                }`}
                value={email}
                onChange={handleEmailChange}
                required
              />
              {!isEmailValid && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
              )}
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
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
            >
              Log In
            </button>
          </form>

          <div className="text-center my-4">OR</div>

          {/* Continue with Google Button */}
          <button
            className="w-full text-black py-2 px-4 rounded hover:bg-gray-300 transition flex items-center justify-center"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            Continue with Google
          </button>

          <div className="mt-4 text-center">
            <p>
              Create your account now!{" "}
              <Link to="/signup" className="text-sky-500 hover:text-sky-600">
                Please Signup
              </Link>
            </p>
            <p className="mt-2">
              <button
                type="button"
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
