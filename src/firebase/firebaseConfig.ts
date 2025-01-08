// import { getAuth } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
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






// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCq8MuPIQMVEzGUSKBXO43A0diSuR0PIlc",
//   authDomain: "firstpick-db.firebaseapp.com",
//   databaseURL: "https://firstpick-db-default-rtdb.asia-southeast1.firebasedatabase.app/",
//   projectId: "firstpick-db",
//   storageBucket: "firstpick-db.firebasestorage.app",
//   messagingSenderId: "1092231436019",
//   appId: "1:1092231436019:web:90901ebc85ee0e81bd4986",
//   measurementId: "G-LQ8YCZSVTS"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export default app;








// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth} from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAO2Z7CjbmJoBFILpbHy3zFzwS29jqBq_w",
//   authDomain: "firstpick--login.firebaseapp.com",
//   databaseURL:"https://firstpick--login-default-rtdb.asia-southeast1.firebasedatabase.app/",
//   projectId: "firstpick--login",
//   storageBucket: "firstpick--login.firebasestorage.app",
//   messagingSenderId: "968047516970",
//   appId: "1:968047516970:web:e3b6eadb1fc17e35791253",
//   measurementId: "G-M4EQHWR3PQ"
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export default app;












// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, Auth } from "firebase/auth";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyAO2Z7CjbmJoBFILpbHy3zFzwS29jqBq_w",
//   authDomain: "firstpick--login.firebaseapp.com",
//   databaseURL: "https://firstpick--login-default-rtdb.asia-southeast1.firebasedatabase.app/",
//   projectId: "firstpick--login",
//   storageBucket: "firstpick--login.firebasestorage.app",
//   messagingSenderId: "968047516970",
//   appId: "1:968047516970:web:e3b6eadb1fc17e35791253",
//   measurementId: "G-M4EQHWR3PQ",
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth: Auth = getAuth(app); // Explicitly typing auth as Auth
// export const database = getDatabase(app);
// // Export 'auth' as a named export and 'app' as the default export
// export { auth };
// export default app;

















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












