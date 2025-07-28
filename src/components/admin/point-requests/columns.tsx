"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"

export type PointRequestWithProfile = {
  id: number;
  created_at: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "denied";
  requester: { full_name: string } | null;
};

export const columns: ColumnDef<PointRequestWithProfile>[] = [
  {
    accessorKey: "requester.full_name",
    header: "Requester",
  },
  {
    accessorKey: "amount",
    header: "Amount",
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
      if (status === 'approved') variant = 'default';
      if (status === 'denied') variant = 'destructive';
      if (status === 'pending') variant = 'outline';
      return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }
  },
  {
    accessorKey: "created_at",
    header: "Date Submitted",
    cell: ({ row }) => format(new Date(row.getValue("created_at")), "PP"),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]