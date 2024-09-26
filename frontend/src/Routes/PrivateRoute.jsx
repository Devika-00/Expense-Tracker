import { useAppSelector } from "../../Redux/store";
import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute: For authenticated users
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// PublicRoute: For non-authenticated users
export const PublicRoute = ({ children }) => {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    return !isAuthenticated ? children : <Navigate to="/" replace />;
};
