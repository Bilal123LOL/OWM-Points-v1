"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type Transaction = {
  id: number;
  created_at: string;
  type: string;
  amount: number;
  note: string | null;
  code_redeemed: string | null;
  related_user?: { full_name: string } | null;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (type === 'admin_adjustment') variant = 'outline';
      if (type === 'code_redemption') variant = 'default';
      if (type === 'transfer_sent') variant = 'destructive';
      if (type === 'transfer_received') variant = 'default';
      if (type === 'request_approved') variant = 'default';
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
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original;
      const note = transaction.note;
      const relatedUser = transaction.related_user?.full_name;
      let detailText = note || "";

      if (transaction.type === 'transfer_sent' && relatedUser) {
          detailText = `To: ${relatedUser}. ${note || ''}`;
      } else if (transaction.type === 'transfer_received' && relatedUser) {
          detailText = `From: ${relatedUser}. ${note || ''}`;
      }
      
      return <div className="truncate max-w-xs">{detailText}</div>
    }
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return <div>{format(new Date(row.getValue("created_at")), "PPpp")}</div>
    },
  },
]