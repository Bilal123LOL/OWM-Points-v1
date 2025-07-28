import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { UpdateProfileForm } from "@/components/settings/UpdateProfileForm";
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Account Settings</h1>
      <UpdateProfileForm />
      <Separator />
      <ChangePasswordForm />
    </div>
  );
};

export default AdminSettings;