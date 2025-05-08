import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebase/firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

// Extend FirebaseUser with our custom properties
interface User extends FirebaseUser {
  isAdmin: boolean; // Changed to boolean for easier conditional checks
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          // Convert string "true"/"false" to boolean
          const isAdmin = userDoc.exists() ? 
            userDoc.data().isAdmin === "true" : false;

          const userData: User = {
            ...currentUser,
            isAdmin, // Store as boolean
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};