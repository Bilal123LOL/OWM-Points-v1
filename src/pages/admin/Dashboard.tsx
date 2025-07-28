import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { Users, CircleDollarSign, HelpCircle, ShieldAlert } from "lucide-react";

const fetchDashboardStats = async () => {
  const [
    { count: totalUsers, error: usersError },
    { data: pointsData, error: pointsError },
    { count: pendingRequests, error: requestsError },
    { count: openReports, error: reportsError },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("points"),
    supabase.from("point_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("security_reports").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  if (usersError) throw new Error(usersError.message);
  if (pointsError) throw new Error(pointsError.message);
  if (requestsError) throw new Error(requestsError.message);
  if (reportsError) throw new Error(reportsError.message);

  const totalPoints = pointsData?.reduce((acc, profile) => acc + profile.points, 0) || 0;

  return {
    totalUsers,
    totalPoints,
    pendingRequests,
    openReports,
  };
};

const AdminDashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchDashboardStats,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Points in Circulation"
          value={stats?.totalPoints.toLocaleString() ?? 0}
          icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Point Requests"
          value={stats?.pendingRequests ?? 0}
          icon={<HelpCircle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
          className={stats && stats.pendingRequests > 0 ? "border-blue-500" : ""}
        />
        <StatCard
          title="Open Security Reports"
          value={stats?.openReports ?? 0}
          icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
          className={stats && stats.openReports > 0 ? "border-destructive" : ""}
        />
      </div>
      {/* We can add more components here later, like recent transactions or user signups */}
    </div>
  );
};

export default AdminDashboardPage;