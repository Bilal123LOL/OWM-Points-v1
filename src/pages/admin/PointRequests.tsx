import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columns, PointRequestWithProfile } from "@/components/admin/point-requests/columns";
import { DataTable } from "@/components/admin/point-requests/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const fetchPointRequests = async (): Promise<PointRequestWithProfile[]> => {
  const { data, error } = await supabase
    .from("point_requests")
    .select(`
      *,
      requester:requester_id (full_name)
    `)
    .order("status", { ascending: true }) // Keep pending requests on top
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  return data as unknown as PointRequestWithProfile[];
};

const PointRequests = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["pointRequestsAdmin"],
    queryFn: fetchPointRequests,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Point Requests Management</CardTitle>
        <CardDescription>Review, approve, or deny user requests for points.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="w-full h-96" />}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {requests && <DataTable columns={columns} data={requests} />}
      </CardContent>
    </Card>
  );
};

export default PointRequests;