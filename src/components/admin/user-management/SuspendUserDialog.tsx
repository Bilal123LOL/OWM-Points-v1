import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";

interface SuspendUserDialogProps {
  user: Profile;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const suspendUser = async ({
  userId,
  suspend,
  reason,
}: {
  userId: string;
  suspend: boolean;
  reason?: string;
}) => {
  const { error } = await supabase
    .from("profiles")
    .update({
      is_suspended: suspend,
      suspended_reason: suspend ? reason : null,
      suspended_at: suspend ? new Date().toISOString() : null,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

export function SuspendUserDialog({
  user,
  isOpen,
  onOpenChange,
}: SuspendUserDialogProps) {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      showSuccess(`User has been ${user.is_suspended ? "unsuspended" : "suspended"}.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
      setReason("");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleSuspend = () => {
    if (user.is_suspended) {
      // Un-suspending
      mutation.mutate({ userId: user.id, suspend: false });
    } else {
      // Suspending
      if (!reason) {
        showError("A reason is required to suspend a user.");
        return;
      }
      mutation.mutate({ userId: user.id, suspend: true, reason });
    }
  };

  const actionText = user.is_suspended ? "Unsuspend" : "Suspend";
  const title = `${actionText} User: ${user.full_name}`;
  const description = user.is_suspended
    ? `Are you sure you want to unsuspend this user? They will regain full access to their account.`
    : `You are about to suspend this user. Please provide a reason. They will be logged out and unable to access their account.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {!user.is_suspended && (
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Suspension</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Violation of terms of service."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={user.is_suspended ? "default" : "destructive"}
            onClick={handleSuspend}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? `${actionText}ing...` : actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}