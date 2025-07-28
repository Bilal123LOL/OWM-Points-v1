import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columns, Transaction } from "@/components/dashboard/transactions/columns";
import { DataTable } from "@/components/dashboard/transactions/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, related_user:related_user_id (full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  return data as Transaction[];
};

const Transactions = () => {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ["userTransactions"],
    queryFn: fetchTransactions,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A log of all your point activity.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="w-full h-96" />}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {transactions && <DataTable columns={columns} data={transactions} />}
      </CardContent>
    </Card>
  );
};

export default Transactions;