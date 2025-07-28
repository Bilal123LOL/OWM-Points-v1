"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"

export type Announcement = {
  id: number;
  created_at: string;
  message: string;
  is_active: boolean;
  creator: { full_name: string } | null;
};

export const columns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return <div className="max-w-md truncate">{message}</div>
    }
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "creator.full_name",
    header: "Created By",
    cell: ({ row }) => row.original.creator?.full_name || "N/A",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.getValue("created_at")), "PP"),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]