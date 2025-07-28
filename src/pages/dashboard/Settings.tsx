import { ChangePasswordForm } from "@/components/dashboard/settings/ChangePasswordForm";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <ChangePasswordForm />
    </div>
  );
};

export default Settings;