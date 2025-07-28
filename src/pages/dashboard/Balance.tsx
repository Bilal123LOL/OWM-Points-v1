import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ActiveAnnouncements } from "@/components/dashboard/ActiveAnnouncements";

const Balance = () => {
  const { profile } = useAuth();
  const pointsColor = profile && profile.points < 0 ? "text-red-500" : "text-primary";

  return (
    <div className="space-y-6">
      <ActiveAnnouncements />
      
      <Card>
        <CardHeader>
          <CardTitle>Points Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Hello, {profile?.full_name}!</p>
          <p className="text-5xl font-bold mt-4">
            You have <span className={cn(pointsColor)}>{profile?.points ?? 0}</span> points.
          </p>
        </CardContent>
      </Card>
    </div>
  );