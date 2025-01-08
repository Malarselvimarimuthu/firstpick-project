// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
import { getAuth,Auth } from "@firebase/auth";
import { getFirestore,Firestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAl63wpt_1SJJPpQcA9GVyAQ0w_4HMmWSY",
  authDomain: "firstpick-database-b30a7.firebaseapp.com",
  projectId: "firstpick-database-b30a7",
  storageBucket: "firstpick-database-b30a7.firebasestorage.app",
  messagingSenderId: "522610199972",
  appId: "1:522610199972:web:7067463d3c0e9e42190531",
  measurementId: "G-QR477N6PDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();
const storageRef = ref(storage);

const auth:Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);
const db = getFirestore(app);

export {auth , firestore,analytics,db};
export default app;

