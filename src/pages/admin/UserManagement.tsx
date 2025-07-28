import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/context/AuthContext";
import { columns } from "@/components/admin/user-management/columns";
import { DataTable } from "@/components/admin/user-management/data-table";
import { Skeleton } from "@/components/ui/skeleton";

const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("account_number", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile[];
};

const UserManagement = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <DataTable columns={columns} data={users || []} />
    </div>
  );
};

export default UserManagement;