

// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAO2Z7CjbmJoBFILpbHy3zFzwS29jqBq_w",
  authDomain: "firstpick--login.firebaseapp.com",
  databaseURL: "https://firstpick--login-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "firstpick--login",
  storageBucket: "firstpick--login.appspot.com",
  messagingSenderId: "968047516970",
  appId: "1:968047516970:web:e3b6eadb1fc17e35791253",
  measurementId: "G-M4EQHWR3PQ",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Optional)
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth: Auth = getAuth(app);

// Initialize Firestore
const firestore: Firestore = getFirestore(app);
const db = getFirestore(app);

// Export all services for use in your app
export { auth, firestore, analytics , db};
export default app;
