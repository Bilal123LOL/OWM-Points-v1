import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Megaphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Announcement = {
  id: number;
  message: string;
};

const fetchActiveAnnouncements = async (): Promise<Announcement[]> => {
  // RLS ensures only active announcements are returned for non-admins
  const { data, error } = await supabase
    .from("announcements")
    .select("id, message")
    .order("created_at", { ascending: false })
    .limit(3); // Show the 3 most recent active announcements

  if (error) {
    console.error("Error fetching announcements:", error);
    return []; // Don't block the UI for this
  }
  return data;
};

export const ActiveAnnouncements = () => {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["activeAnnouncements"],
    queryFn: fetchActiveAnnouncements,
    staleTime: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!announcements || announcements.length === 0) {
    return null; // Don't render anything if there are no announcements
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Alert key={announcement.id}>
          <Megaphone className="h-4 w-4" />
          <AlertTitle>Announcement</AlertTitle>
          <AlertDescription>{announcement.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};