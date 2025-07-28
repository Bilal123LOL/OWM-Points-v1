import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
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
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  code: z.string().min(1, "Please enter a code."),
});

const Redeem = () => {
  const { refetchProfile } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const redeemMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.rpc('redeem_code', { redemption_code: code });
      if (error) {
        // The error message from the DB function is user-friendly
        throw new Error(error.message.replace('error: ', ''));
      }
      return data;
    },
    onSuccess: (data) => {
      showSuccess(data);
      refetchProfile(); // This updates the points display in the dashboard
      form.reset();
    },
    onError: (error: Error) => {
      showError(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    redeemMutation.mutate(values.code);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redeem a Code</CardTitle>
        <CardDescription>
          Have a code? Enter it below to add points to your account.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redemption Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={redeemMutation.isPending}>
              {redeemMutation.isPending ? "Redeeming..." : "Redeem Code"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Redeem;