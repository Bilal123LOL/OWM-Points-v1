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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { columns, UserSecurityReport } from "@/components/dashboard/security/columns";
import { DataTable } from "@/components/dashboard/security/data-table";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  reason: z.string({ required_error: "Please select a reason." }),
  details: z.string().min(20, "Please provide at least 20 characters of detail.").max(2000),
});

const fetchReports = async (): Promise<UserSecurityReport[]> => {
  const { data, error } = await supabase
    .from("security_reports")
    .select("case_id, created_at, reason, status")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const Security = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reports, isLoading, error: fetchError } = useQuery({
    queryKey: ["userSecurityReports"],
    queryFn: fetchReports,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: undefined,
      details: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user) throw new Error("User not authenticated.");
      const { error } = await supabase.from("security_reports").insert({
        reason: values.reason,
        details: { description: values.details },
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Security report submitted successfully. Our team will review it shortly.");
      queryClient.invalidateQueries({ queryKey: ["userSecurityReports"] });
      queryClient.invalidateQueries({ queryKey: ["securityReports"] }); // Invalidate admin query
      form.reset();
    },
    onError: (error: any) => {
      showError(error.message || "Failed to submit report.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Security Report</CardTitle>
          <CardDescription>
            If you've noticed suspicious activity or a potential security issue, please let us know.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Report</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Suspicious activity on my account">Suspicious activity on my account</SelectItem>
                        <SelectItem value="Potential cheating or system abuse by another user">Potential cheating or system abuse by another user</SelectItem>
                        <SelectItem value="Found a security vulnerability in the application">Found a security vulnerability in the application</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide as much detail as possible, including account numbers, times, and a description of the issue."
                        className="min-h-[120px]"
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
                {mutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Your Report History</CardTitle>
          <CardDescription>A log of all your past security reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="w-full h-64" />}
          {fetchError && <div className="text-red-500">Error: {fetchError.message}</div>}
          {reports && <DataTable columns={columns} data={reports} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;