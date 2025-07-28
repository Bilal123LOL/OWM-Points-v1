"use client"

import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { PointRequestWithProfile } from "./columns"

interface DataTableRowActionsProps {
  row: Row<PointRequestWithProfile>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const request = row.original
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; action?: "approved" | "denied" }>({ isOpen: false });
  const queryClient = useQueryClient()
  const { profile: adminProfile } = useAuth();

  const mutation = useMutation({
    mutationFn: async (action: "approved" | "denied") => {
      if (!adminProfile) throw new Error("Admin not logged in.");
      const { error } = await supabase.rpc('review_point_request', {
        request_id_to_review: request.id,
        new_status: action,
        admin_id: adminProfile.id,
      });
      if (error) throw error;
    },
    onSuccess: (_, action) => {
      showSuccess(`Request has been ${action}.`);
      queryClient.invalidateQueries({ queryKey: ["pointRequestsAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate users to update points
      setDialogState({ isOpen: false });
    },
    onError: (error: any) => {
      showError(error.message || "Failed to process request.");
    },
  });

  const handleAction = () => {
    if (dialogState.action) {
      mutation.mutate(dialogState.action);
    }
  };

  if (request.status !== 'pending') {
    return null; // Don't show actions for already reviewed requests
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
          <DropdownMenuLabel>Review Request</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDialogState({ isOpen: true, action: "approved" })}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-700"
            onClick={() => setDialogState({ isOpen: true, action: "denied" })}
          >
            Deny
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState({ isOpen })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {dialogState.action} this request for {request.amount} points from {request.requester?.full_name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={mutation.isPending}
              className={dialogState.action === 'denied' ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {mutation.isPending ? "Processing..." : `Confirm ${dialogState.action}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}