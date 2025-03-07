import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Loading state
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
