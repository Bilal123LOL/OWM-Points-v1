"use client"

import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { showSuccess, showError } from "@/utils/toast"
import { Announcement } from "./columns"

interface DataTableRowActionsProps {
  row: Row<Announcement>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const announcement = row.original
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !announcement.is_active })
        .eq("id", announcement.id)
      if (error) throw error
    },
    onSuccess: () => {
      showSuccess(`Announcement has been ${announcement.is_active ? "deactivated" : "activated"}.`)
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
    },
    onError: (error: any) => {
      showError(error.message || "Failed to update status.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcement.id)
      if (error) throw error
    },
    onSuccess: () => {
      showSuccess("Announcement has been deleted.")
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      showError(error.message || "Failed to delete announcement.")
    },
  })

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
          <DropdownMenuItem onClick={() => toggleStatusMutation.mutate()}>
            {announcement.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-700 focus:bg-red-100"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the announcement. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}