"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Profile } from "@/context/AuthContext"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Profile>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "account_number",
    header: "Account Number",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "is_suspended",
    header: "Status",
    cell: ({ row }) => {
      const isSuspended = row.getValue("is_suspended")
      return (
        <Badge variant={isSuspended ? "destructive" : "default"}>
          {isSuspended ? "Suspended" : "Active"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]