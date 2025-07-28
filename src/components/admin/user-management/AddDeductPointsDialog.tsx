import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile, useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";

interface AddDeductPointsDialogProps {
  user: Profile;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddDeductPointsDialog({
  user,
  isOpen,
  onOpenChange,
}: AddDeductPointsDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const { profile: adminProfile } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ point_change, admin_note }: { point_change: number; admin_note: string }) => {
      if (!adminProfile) throw new Error("Admin profile not found.");
      
      const { error } = await supabase.rpc('admin_adjust_points', {
        target_user_id: user.id,
        point_change,
        admin_note,
        admin_id: adminProfile.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess(`Successfully adjusted points for ${user.full_name}.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
      setAmount(0);
      setNote("");
    },
    onError: (error: any) => {
      showError(error.message || "Failed to adjust points.");
    },
  });

  const handleSubmit = () => {
    if (amount === 0) {
      showError("Amount cannot be zero.");
      return;
    }
    if (!note) {
      showError("A note is required for the transaction.");
      return;
    }
    mutation.mutate({ point_change: amount, admin_note: note });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add/Deduct Points for {user.full_name}</DialogTitle>
          <DialogDescription>
            Enter a positive value to add points or a negative value to deduct them. A note is required for the transaction log.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Points Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
              placeholder="e.g., 50 or -20"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note / Reason</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Bonus for excellent performance."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}