"use client"

import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SecurityReport } from "./columns"
import { UpdateReportStatusDialog } from "./UpdateReportStatusDialog"
import { ViewReportDetailsDialog } from "./ViewReportDetailsDialog"

interface DataTableRowActionsProps {
  row: Row<SecurityReport>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const report = row.original
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
            Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateReportStatusDialog
        report={report}
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
      <ViewReportDetailsDialog
        report={report}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </>
  )