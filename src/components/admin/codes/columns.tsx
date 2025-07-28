"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"

export type Code = {
  id: number;
  created_at: string;
  code: string;
  points: number;
  max_uses: number;
  current_uses: number;
  is_deleted: boolean;
  creator: { full_name: string } | null;
};

export const columns: ColumnDef<Code>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    header: "Usage",
    cell: ({ row }) => {
      const { current_uses, max_uses } = row.original;
      return `${current_uses} / ${max_uses}`;
    },
  },
  {
    accessorKey: "is_deleted",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.getValue("is_deleted");
      const { current_uses, max_uses } = row.original;
      const isExhausted = current_uses >= max_uses;

      if (isDeleted) {
        return <Badge variant="destructive">Deleted</Badge>;
      }
      if (isExhausted) {
        return <Badge variant="secondary">Exhausted</Badge>;
      }
      return <Badge variant="default">Active</Badge>;
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