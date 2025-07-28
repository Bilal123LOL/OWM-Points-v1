import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the central hub for managing the OWM Points system.</p>
          <p className="mt-2">Use the sidebar to navigate through the different management sections.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;