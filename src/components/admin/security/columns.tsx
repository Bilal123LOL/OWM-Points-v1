"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"

export type SecurityReport = {
  id: number;
  case_id: string;
  created_at: string;
  reason: string;
  status: "open" | "under_review" | "resolved";
  user: { 
    id: string;
    full_name: string;
    account_number: string;
  } | null;
  details: any;
};

export const columns: ColumnDef<SecurityReport>[] = [
  {
    accessorKey: "case_id",
    header: "Case ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("case_id")}</div>
  },
  {
    accessorKey: "user.full_name",
    header: "User",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return <div className="max-w-xs truncate">{reason}</div>
    }
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
    header: "Reported At",
    cell: ({ row }) => format(new Date(row.getValue("created_at")), "PP"),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]