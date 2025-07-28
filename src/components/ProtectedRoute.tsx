import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRoles?: ("Admin" | "Regular User")[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, loading, profile } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect if user's role is not allowed
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;