import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { columns, TransactionWithProfiles } from "@/components/admin/transactions/columns";
import { DataTable } from "@/components/admin/transactions/data-table";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTransactions = async (): Promise<TransactionWithProfiles[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      profiles:user_id (full_name),
      related_user:related_user_id (full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw new Error(error.message);
  }
  
  return data as unknown as TransactionWithProfiles[];
};

const AdminTransactions = () => {
  const [searchParams] = useSearchParams();
  const userFilter = searchParams.get("user");

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Transaction Log</h1>
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transaction Log</h1>
      <DataTable columns={columns} data={transactions || []} initialFilterValue={userFilter || ""} />
    </div>
  );
};

export default AdminTransactions;