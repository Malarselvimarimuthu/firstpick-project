

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






































// import React, { useState } from "react";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
//   applyActionCode,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { getFirestore, doc,getDoc, setDoc,deleteDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import app from "../../firebase/firebaseConfig";
// import logo from "../../assets/images/cart.jpg";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const SignUp: React.FC = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [reEnterPassword, setReEnterPassword] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isVerified, setIsVerified] = useState(false); // Flag for verification status
//   const [showPassword, setShowPassword] = useState(false);
//   const [showReEnterPassword, setShowReEnterPassword] = useState(false);
//   const navigate = useNavigate(); // Initialize navigate


//   const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   const sendOTPEmail = async (email: string, otp: string) => {
//     try {
//       await fetch('/api/send-otp-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp })
//       });
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleManualSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Password validation
//     if (password !== reEnterPassword) {
//       setError("Passwords do not match!");
//       return;
//     }
//     localStorage.setItem("userEmail", email);
//     alert("Email saved successfully!");
//      console.log("Email saved to local storage:", email);
//     const auth = getAuth(app);
//     const db = getFirestore(app);

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       await sendEmailVerification(user);
//       setSuccessMessage("Sign-Up successful! A verification email has been sent. Please check your email.");

//       const otp = generateOTP();
//       await sendOTPEmail(email, otp);


//       await setDoc(doc(db, "otpVerification", user.uid), {
//         otp,
//         email,
//         username,
//         createdAt: new Date().toISOString()
//       });

//       setSuccessMessage("Sign-Up successful! Please check your email for OTP.");
//       setIsVerified(true);
//      } catch (error: any) {
//       console.error("Error signing up:", error.message);
//       setError(`Sign-Up failed: ${error.message}`);
//     }
//   };

//   const handleVerifyCode = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const auth = getAuth(app);
//     const db = getFirestore(app);

//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("No user found");

//       const otpDoc = await getDoc(doc(db, "otpVerification", user.uid));
//       const storedOTP = otpDoc.data()?.otp;

//       if (verificationCode === storedOTP) {
//         await setDoc(doc(db, "users", user.uid), {
//           uid: user.uid,
//           username: username,
//           email: user.email,
//           createdAt: new Date().toISOString(),
//         });

//         await deleteDoc(doc(db, "otpVerification", user.uid));

//         navigate("/login");
//         setUsername("");
//       } else {
//         setError("Invalid OTP");
//       }
//     } catch (error: any) {
//       console.error("Error verifying code:", error.message);
//       setError(`Verification failed: ${error.message}`);
//     }
//   };

//   const togglePasswordVisibility = (): void => {
//     setShowPassword(!showPassword);
//   };
//   const toggleReEnterPasswordVisibility = () => {
//     setShowReEnterPassword((prev) => !prev);
//   };
  

//   const handleGoogleSignUp = async () => {
//     const auth = getAuth(app);
//     const provider = new GoogleAuthProvider();

//     try {
//       // Sign in with Google
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const db = getFirestore(app);

//       // Store user data in Firestore after successful Google sign-in
//       await setDoc(doc(db, "users", user.uid), {
//         uid: user.uid,
//         username: user.displayName,
//         email: user.email,
//         createdAt: new Date().toISOString(),
//       });

//       // Redirect to home or dashboard after successful Google sign-in
//       navigate("/");
//     } catch (error: any) {
//       console.error("Error signing up with Google:", error.message);
//       setError(`Google Sign-In failed: ${error.message}`);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row mt-10">
//       {/* Left side with image */}
//       <div className="w-full md:w-1/2 bg-cover bg-center flex justify-center items-center">
//         <img src={logo} alt="Logo" className="w-full h-full object-cover" />
//       </div>

//       {/* Right side with form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-md rounded-lg p-8">
//         <div className="w-full max-w-md">
//           <h1 className="text-[40px] text-gray-800">Create an Account</h1>
//           <h4 className="text-gray-800 text-[20px]">Enter your details below</h4>
//           <br />

//           {/* Sign-Up Form */}
//           {!isVerified ? (
//             <form onSubmit={handleManualSignUp} className="mb-4">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-semibold">Username</label>
//                 <input
//                   type="text"
//                   className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-semibold">Email</label>
//                 <input
//                   type="email"
//                   className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               {/* Password Field */}
//       <div className="mb-4 relative">
//         <label className="block text-gray-700 font-semibold">Password</label>
//         <input
//           type={showPassword ? "text" : "password"}
//           className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <span
//           onClick={togglePasswordVisibility}
//           className="absolute right-3 top-9 cursor-pointer"
//         >
//           {showPassword ? <FaEyeSlash /> : <FaEye />}
//         </span>
//       </div>

//       {/* Re-enter Password Field */}
//       <div className="mb-4 relative">
//         <label className="block text-gray-700 font-semibold">Re-enter Password</label>
//         <input
//           type={showReEnterPassword ? "text" : "password"}
//           className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
//           value={reEnterPassword}
//           onChange={(e) => setReEnterPassword(e.target.value)}
//           required
//         />
//         <span
//           onClick={toggleReEnterPasswordVisibility}
//           className="absolute right-3 top-9 cursor-pointer"
//         >
//           {showReEnterPassword ? <FaEyeSlash /> : <FaEye />}
//         </span>
//       </div>
//               <button
//                 type="submit"
//                 className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
//               >
//                 Sign Up
//               </button>
//             </form>
//           ) : (
//             /* Verification Code Form */
//             <form onSubmit={handleVerifyCode} className="mb-4">
//               <div className="mb-4">
//                 <label className="block text-gray-700">Enter OTP</label>
//                 <input
//                   type="text"
//                   className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
//                   value={verificationCode}
//                   onChange={(e) => setVerificationCode(e.target.value)}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
//               >
//                 Verify OTP
//               </button>
//             </form>
//           )}

//           {/* Google Sign-Up Button */}
//           <div className="text-center my-4">OR</div>
//           <button
//             className="w-full text-black py-2 px-4 rounded hover:bg-gray-300 transition"
//             onClick={handleGoogleSignUp}
//           >
//             <img
//               src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
//               alt="Google"
//               className="inline-block w-6 h-6 mr-2"
//             />
//             Continue with Google
//           </button>

//           {/* Already have an account link */}
//           <div className="mt-4 text-center">
//             <p>
//               Already have an account?{" "}
//               <a href="/login" className="text-sky-500 hover:text-sky-600">Please Login</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;





