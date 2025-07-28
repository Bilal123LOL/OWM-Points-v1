"use client"

import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Profile } from "@/context/AuthContext"
import { SuspendUserDialog } from "./SuspendUserDialog"
import { AddDeductPointsDialog } from "./AddDeductPointsDialog"
import { ResetPasswordDialog } from "./ResetPasswordDialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Profile>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = row.original
  const navigate = useNavigate()
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)

  const handleViewTransactions = () => {
    navigate(`/admin/transactions?user=${encodeURIComponent(user.full_name)}`)
  }

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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(user.account_number)}
          >
            Copy Account Number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewTransactions}>
            View transactions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsPointsDialogOpen(true)}>
            Add/Deduct points
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsResetPasswordDialogOpen(true)}>
            Send password reset
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-700 focus:bg-red-100"
            onClick={() => setIsSuspendDialogOpen(true)}
          >
            {user.is_suspended ? "Unsuspend user" : "Suspend user"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SuspendUserDialog
        user={user}
        isOpen={isSuspendDialogOpen}
        onOpenChange={setIsSuspendDialogOpen}
      />
      <AddDeductPointsDialog
        user={user}
        isOpen={isPointsDialogOpen}
        onOpenChange={setIsPointsDialogOpen}
      />
      <ResetPasswordDialog
        user={user}
        isOpen={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
      />
    </>
  )