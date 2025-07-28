import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { columns, PointRequest } from "@/components/dashboard/requests/columns";
import { DataTable } from "@/components/dashboard/requests/data-table";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  amount: z.coerce.number().int().positive("Amount must be a positive number."),
  reason: z.string().min(10, "Reason must be at least 10 characters long.").max(500),
});

const fetchRequests = async (): Promise<PointRequest[]> => {
  const { data, error } = await supabase
    .from("point_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const Requests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error: fetchError } = useQuery({
    queryKey: ["pointRequests"],
    queryFn: fetchRequests,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user) throw new Error("User not authenticated.");
      const { error } = await supabase.from("point_requests").insert({
        ...values,
        requester_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Point request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["pointRequests"] });
      form.reset();
    },
    onError: (error: any) => {
      showError(error.message || "Failed to submit request.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Points</CardTitle>
          <CardDescription>
            Need more points? Fill out the form below to request them from an administrator.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Requested</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Request</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a detailed reason for your request..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Your Request History</CardTitle>
          <CardDescription>A log of all your past point requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="w-full h-64" />}
          {fetchError && <div className="text-red-500">Error: {fetchError.message}</div>}
          {requests && <DataTable columns={columns} data={requests} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Requests;