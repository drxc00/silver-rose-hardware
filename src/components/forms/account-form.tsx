"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { accountFormSchema } from "@/lib/form-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { updateAccountDetails } from "@/app/(server)/actions/account-actions";
import { useToast } from "@/hooks/use-toast";

export function AccountForm({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      userId: user.id || "",
      name: user.name || "",
      email: user.email || "",
      password: "",
      username: user.username || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof accountFormSchema>) => {
    try {
      // Invoke the server actions
      await updateAccountDetails(data);
      toast({
        title: "Success",
        description: "Account details updated successfully.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
    // Reset the form
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="*****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center w-full gap-4">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
