import AdminLayout from "@/components/AdminLayout";
import { Navigate, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  // By default, redirect to the user management page
  // We use Outlet to render nested routes within the layout
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminDashboard;