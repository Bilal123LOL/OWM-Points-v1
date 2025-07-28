import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  recipientAccountNumber: z.string().min(1, "Recipient account number is required."),
  amount: z.coerce.number().int().positive("Amount must be a positive number."),
  note: z.string().max(200, "Note must be 200 characters or less.").optional(),
});

const Transfer = () => {
  const { refetchProfile } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientAccountNumber: "",
      amount: 0,
      note: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase.rpc('transfer_points', {
        recipient_account_number: values.recipientAccountNumber,
        amount_to_transfer: values.amount,
        transfer_note: values.note || '',
      });
      if (error) {
        throw new Error(error.message.replace('error: ', ''));
      }
      return data;
    },
    onSuccess: (data) => {
      showSuccess(data);
      refetchProfile(); // This updates the points display in the dashboard
      queryClient.invalidateQueries({ queryKey: ["userTransactions"] }); // Refresh transaction history
      form.reset();
    },
    onError: (error: Error) => {
      showError(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    transferMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Points</CardTitle>
        <CardDescription>
          Send points to another user. Please double-check the account number before sending.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="recipientAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient's Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 02" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to Transfer</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., For lunch yesterday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={transferMutation.isPending}>
              {transferMutation.isPending ? "Sending..." : "Send Points"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Transfer;