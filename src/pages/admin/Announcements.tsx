import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columns, Announcement } from "@/components/admin/announcements/columns";
import { DataTable } from "@/components/admin/announcements/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateAnnouncementDialog } from "@/components/admin/announcements/CreateAnnouncementDialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from("announcements")
    .select(`
      *,
      creator:created_by (full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as Announcement[];
};

const Announcements = () => {
  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Announcements Management</CardTitle>
            <CardDescription>Create and manage announcements for all users.</CardDescription>
          </div>
          <CreateAnnouncementDialog />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="w-full h-96" />}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {announcements && <DataTable columns={columns} data={announcements} />}
      </CardContent>
    </Card>
  );
};

export default Announcements;