import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columns, SecurityReport } from "@/components/admin/security/columns";
import { DataTable } from "@/components/admin/security/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const fetchSecurityReports = async (): Promise<SecurityReport[]> => {
  const { data, error } = await supabase
    .from("security_reports")
    .select(`
      id,
      case_id,
      created_at,
      reason,
      status,
      details,
      user:user_id (id, full_name, account_number)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as SecurityReport[];
};

const Security = () => {
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["securityReports"],
    queryFn: fetchSecurityReports,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Security Reports</CardTitle>
            <CardDescription>Manage and track security-related incidents.</CardDescription>
          </div>
          {/* <CreateReportDialog /> We will add this later */}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="w-full h-96" />}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {reports && <DataTable columns={columns} data={reports} />}
      </CardContent>
    </Card>
  );
};

export default Security;