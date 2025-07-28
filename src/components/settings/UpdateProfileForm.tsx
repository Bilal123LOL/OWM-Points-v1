import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { showSuccess, showError } from "@/utils/toast";
import { useEffect } from "react";

const formSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters long."),
});

export const UpdateProfileForm = () => {
  const { profile, refetchProfile } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ full_name: profile.full_name });
    }
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!profile) throw new Error("User profile not found.");
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: values.full_name })
        .eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await refetchProfile();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("Profile updated successfully!");
    },
    onError: (error: any) => {
      showError(error.message || "Failed to update profile.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>
          Update your personal information here.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Profile"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};