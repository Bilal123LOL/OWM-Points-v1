import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { profile } = useAuth();

  // Redirect to balance page by default
  if (profile?.role === "Regular User") {
    return (
      <DashboardLayout>
        <Navigate to="/dashboard/balance" replace />
      </DashboardLayout>
    );
  }

  // Fallback or handle other roles if necessary
  return <Navigate to="/" replace />;
};

export default Dashboard;