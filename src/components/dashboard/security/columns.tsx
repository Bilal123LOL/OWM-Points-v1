"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type UserSecurityReport = {
  case_id: string;
  created_at: string;
  reason: string;
  status: "open" | "under_review" | "resolved";
};

export const columns: ColumnDef<UserSecurityReport>[] = [
  {
    accessorKey: "case_id",
    header: "Case ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("case_id")}</div>
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (status === 'resolved') variant = 'default';
      if (status === 'open') variant = 'destructive';
      if (status === 'under_review') variant = 'outline';
      return <Badge variant={variant}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
    }
  },
  {
    accessorKey: "created_at",
    header: "Date Submitted",
    cell: ({ row }) => {
      return <div>{format(new Date(row.getValue("created_at")), "PP")}</div>
    },
  },
]