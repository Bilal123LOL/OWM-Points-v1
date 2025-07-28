import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Balance = () => {
  const { profile } = useAuth();
  const pointsColor = profile && profile.points < 0 ? "text-red-500" : "text-primary";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Balance</h1>
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
};

export default Balance;