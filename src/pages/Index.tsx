import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // We will create these pages in the next steps
  if (profile.role === "Admin") {
    // return <Navigate to="/admin" replace />;
    return <div>Welcome Admin! (Admin Dashboard coming soon)</div>;
  }

  if (profile.role === "Regular User") {
    // return <Navigate to="/dashboard" replace />;
    return <div>Welcome User! (User Dashboard coming soon)</div>;
  }

  return <Navigate to="/login" replace />;
};

export default Index;