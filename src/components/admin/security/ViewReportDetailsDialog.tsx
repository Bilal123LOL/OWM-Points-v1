import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SecurityReport } from "./columns";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ViewReportDetailsDialogProps {
  report: SecurityReport;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ViewReportDetailsDialog({
  report,
  isOpen,
  onOpenChange,
}: ViewReportDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Security Report Details</DialogTitle>
          <DialogDescription>
            Case ID: <span className="font-mono">{report.case_id}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground">User</span>
            <span className="col-span-2">{report.user?.full_name} ({report.user?.account_number})</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground">Reported At</span>
            <span className="col-span-2">{format(new Date(report.created_at), "PPpp")}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground">Status</span>
            <div className="col-span-2">
              <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'open' ? 'destructive' : 'outline'}>
                {report.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-sm font-semibold text-muted-foreground pt-1">Reason</span>
            <p className="col-span-2">{report.reason}</p>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-sm font-semibold text-muted-foreground pt-1">Full Details</span>
            <p className="col-span-2 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
              {report.details?.description || "No additional details provided."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}