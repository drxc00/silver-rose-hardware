"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "@/lib/form-schema";
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
import { clientLogin } from "@/app/(server)/actions/auth-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Loader2Icon } from "lucide-react";

export function LoginForm({ type }: { type: "ADMIN" | "CUSTOMER" }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsPending(true);
    try {
      await clientLogin(data, type);
    } catch (error) {
      // So based on the documentation, NextJs perform redirects through errors
      // So we need to throw the error if it is a redirect error since we are catching credentials errors only
      // Weird approach but ok.
      if (isRedirectError(error)) throw error;
      toast({
        title: "Login Error!",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <div>{error && <p className="text-red-500">{error}</p>}</div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username"
                  {...field}
                  className="focus-visible:ring-transparent"
                />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="password"
                  type="password"
                  {...field}
                  className="focus-visible:ring-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
