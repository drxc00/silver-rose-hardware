"use client";
import { useQuotation } from "@/components/providers/quotation-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { quotationRequestSchema } from "@/lib/form-schema";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { QuotationSummaryTable } from "./quotation-summary-table";
import { useToast } from "@/hooks/use-toast";
import { createQuotationRequest } from "@/app/(server)/actions/quotation-mutations";
import { useState, useTransition } from "react";
import { Loader2, MailCheck } from "lucide-react";
import Link from "next/link";

interface QuotationRequestFormProps {
  user: User;
}

export function QuotationRequestForm({ user }: QuotationRequestFormProps) {
  const { quotation } = useQuotation();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);

  const form = useForm<z.infer<typeof quotationRequestSchema>>({
    defaultValues: {
      userId: user.id,
      quotationId: quotation.quotationId,
      userQuotationId: quotation.id,
      name: user.name || "",
      email: user.email || "",
      phone: "",
      note: "",
    },
  });

  // Calculate
  const calculateSubtotal = () => {
    return quotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item?.variant?.price) * Number(item?.quantity),
      0
    );
  };

  const onSubmit = async (values: z.infer<typeof quotationRequestSchema>) => {
    // Check if the quotation is empty
    if (quotation.quotation.QuotationItem.length === 0) {
      toast({
        title: "Empty Quotation",
        description: "Your quotation is empty.",
        variant: "destructive",
      });
      return;
    }
    // Validate the payload
    if (values.note === "") {
      toast({
        title: "Invalid Form Data",
        description: "Please check your form data and try again.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        await createQuotationRequest(values);
        // router.refresh();
        setIsRequestSuccess(true);
      } catch (error) {
        toast({
          title: "An Error Occurred",
          description: `[${(error as Error).name}] Please try again later.`,
          variant: "destructive",
        });
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col gap-4 items-center">
          <Loader2 className="animate-spin w-10 h-10" />
          <p className="text-muted-foreground text-lg">Sending Request</p>
        </div>
      </div>
    );
  }

  if (isRequestSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col text-center items-center justify-center">
          <MailCheck className="text-green-500 w-10 h-10" />
          <h1 className="text-2xl font-bold">Request Sent</h1>
          <p>
            Thank you for your request. We&apos;ve successfully received your
            quotation details.
          </p>
          <p className="text-muted-foreground italic">
            You will receive an update on your quotation within 24-48 hours.
          </p>
          <Link href="/quotation/history">
            <Button className="mt-4">View All Requests</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex text-center justify-center items-center pb-6">
        <h1 className="text-3xl font-bold text-center">Quotation Request</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="rounded-sm shadow-none">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
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
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number <span className="text-muted-foreground">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+639123456789" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Note <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px]"
                        placeholder="Add any special requests or instructions (e.g., cutting, bulk order discounts, custom sizes, etc.)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <h3 className="pt-4 pb-2 font-semibold">Quotation Summary</h3>
                <div className="overflow-x-auto rounded-sm border">
                  <QuotationSummaryTable quotation={quotation} />
                </div>
                <div className="flex flex-row gap-4 justify-end text-xl pt-8">
                  <h3 className="font-semibold text-muted-foreground">
                    Total Cost
                  </h3>
                  <h3 className="font-semibold text-primary">
                    ₱ {calculateSubtotal().toLocaleString()}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Tap on &apos;Request Quotation, &apos; and we &apos;ll
              provide our best price, including any applicable service charges
              for custom requests.
            </p>
            <Button size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <MailCheck className="w-4 h-4" />
                  <span>Request Quotation</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
