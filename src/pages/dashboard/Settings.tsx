import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { UpdateProfileForm } from "@/components/settings/UpdateProfileForm";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <UpdateProfileForm />
      <Separator />
      <ChangePasswordForm />
    </div>
  );
};

export default Settings;