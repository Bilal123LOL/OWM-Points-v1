import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SecurityReport } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";

interface UpdateReportStatusDialogProps {
  report: SecurityReport;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function UpdateReportStatusDialog({
  report,
  isOpen,
  onOpenChange,
}: UpdateReportStatusDialogProps) {
  const [status, setStatus] = useState<SecurityReport["status"]>(report.status);
  const { profile: adminProfile } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newStatus: SecurityReport["status"]) => {
      if (!adminProfile) throw new Error("Admin not logged in.");
      
      const updateData: { status: string; resolved_by?: string; resolved_at?: string } = {
        status: newStatus,
      };

      if (newStatus === 'resolved') {
        updateData.resolved_by = adminProfile.id;
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("security_reports")
        .update(updateData)
        .eq("id", report.id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Report status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["securityReports"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      showError(error.message || "Failed to update report status.");
    },
  });

  const handleSubmit = () => {
    mutation.mutate(status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status for Case #{report.case_id.substring(0, 8)}</DialogTitle>
          <DialogDescription>
            Change the status of the security report for {report.user?.full_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={status} onValueChange={(value: SecurityReport["status"]) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}