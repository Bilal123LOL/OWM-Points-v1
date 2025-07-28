"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type PointRequest = {
  id: number;
  created_at: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "denied";
};

export const columns: ColumnDef<PointRequest>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
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
      if (status === 'approved') variant = 'default';
      if (status === 'denied') variant = 'destructive';
      if (status === 'pending') variant = 'outline';
      return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
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