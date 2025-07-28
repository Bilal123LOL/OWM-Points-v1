import { ChangePasswordForm } from "@/components/dashboard/settings/ChangePasswordForm";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Account Settings</h1>
      <ChangePasswordForm />
    </div>
  );
};

export default AdminSettings;