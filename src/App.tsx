import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// User Dashboard Pages
import DashboardLayout from "./components/DashboardLayout";
import Balance from "./pages/dashboard/Balance";
import Transfer from "./pages/dashboard/Transfer";
import Transactions from "./pages/dashboard/Transactions";
import Redeem from "./pages/dashboard/Redeem";
import Requests from "./pages/dashboard/Requests";
import Settings from "./pages/dashboard/Settings";

// Admin Dashboard Pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminTransactions from "./pages/admin/Transactions";
import Codes from "./pages/admin/Codes";
import Announcements from "./pages/admin/Announcements";
import PointRequests from "./pages/admin/PointRequests";
import Security from "./pages/admin/Security";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Navigate to="balance" replace />} />
                <Route path="balance" element={<Balance />} />
                <Route path="transfer" element={<Transfer />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="redeem" element={<Redeem />} />
                <Route path="requests" element={<Requests />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="codes" element={<Codes />} />
                  <Route path="announcements" element={<Announcements />} />
                  <Route path="requests" element={<PointRequests />} />
                  <Route path="security" element={<Security />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;