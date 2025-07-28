"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type TransactionWithProfiles = {
  id: number;
  created_at: string;
  type: string;
  amount: number;
  note: string | null;
  profiles: { full_name: string } | null;
  related_user: { full_name: string } | null;
};

export const columns: ColumnDef<TransactionWithProfiles>[] = [
  {
    accessorKey: "profiles.full_name",
    header: "User",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (type === 'admin_adjustment') variant = 'outline';
      if (type === 'code_redemption') variant = 'default';
      return <Badge variant={variant}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US").format(amount)
      const color = amount > 0 ? "text-green-600" : "text-red-600";
      return <div className={`font-medium ${color}`}>{amount > 0 ? `+${formatted}` : formatted}</div>
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "related_user.full_name",
    header: "Admin",
    cell: ({ row }) => row.original.related_user?.full_name || "N/A",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return <div>{format(new Date(row.getValue("created_at")), "PPpp")}</div>
    },
  },
]