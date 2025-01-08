import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebase/firebaseConfig"; // Import Firebase auth module
import { onAuthStateChanged, User } from "firebase/auth";

// Define the type for the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Define the type for the AuthProvider props
interface AuthProviderProps {
  children: ReactNode; // Children can be any valid React node
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component with children prop type
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user state
      setLoading(false); // Set loading to false once the auth state is determined
    });

    // Cleanup the subscription on component unmount
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
