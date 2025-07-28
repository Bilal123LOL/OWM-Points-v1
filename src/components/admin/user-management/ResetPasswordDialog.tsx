import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showSuccess, showError } from "@/utils/toast";

interface ResetPasswordDialogProps {
  user: Profile;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ResetPasswordDialog({
  user,
  isOpen,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const mutation = useMutation({
    mutationFn: async () => {
      const email = `${user.account_number}@owmpoints.app`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess(`Password reset link sent to user ${user.full_name}.`);
      onOpenChange(false);
    },
    onError: (error: any) => {
      showError(error.message || "Failed to send reset link.");
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Password Reset?</AlertDialogTitle>
          <AlertDialogDescription>
            This will send a password reset link to the email associated with account number {user.account_number}. The user will be prompted to create a new password. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Send Reset Link"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}