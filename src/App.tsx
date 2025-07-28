import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// User Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Balance from "./pages/dashboard/Balance";
import Transfer from "./pages/dashboard/Transfer";
import Transactions from "./pages/dashboard/Transactions";
import Redeem from "./pages/dashboard/Redeem";
import Requests from "./pages/dashboard/Requests";
import Settings from "./pages/dashboard/Settings";

// Placeholder for Admin pages
// import AdminDashboard from "./pages/admin/AdminDashboard";

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
              
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="balance" element={<Balance />} />
                <Route path="transfer" element={<Transfer />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="redeem" element={<Redeem />} />
                <Route path="requests" element={<Requests />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* 
                Example of role-specific routes we will add later:
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;