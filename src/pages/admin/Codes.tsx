import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columns, Code } from "@/components/admin/codes/columns";
import { DataTable } from "@/components/admin/codes/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCodeDialog } from "@/components/admin/codes/CreateCodeDialog";

const fetchCodes = async (): Promise<Code[]> => {
  const { data, error } = await supabase
    .from("codes")
    .select(`
      *,
      creator:created_by (full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as Code[];
};

const Codes = () => {
  const { data: codes, isLoading, error } = useQuery({
    queryKey: ["codes"],
    queryFn: fetchCodes,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Codes Management</h1>
        <CreateCodeDialog />
      </div>
      {isLoading && <Skeleton className="w-full h-96" />}
      {error && <div className="text-red-500">Error: {error.message}</div>}
      {codes && <DataTable columns={columns} data={codes} />}
    </div>
  );
};

export default Codes;