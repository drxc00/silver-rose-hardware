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

interface QuotationRequestFormProps {
  user: User;
}

export function QuotationRequestForm({ user }: QuotationRequestFormProps) {
  const { quotation } = useQuotation();

  const form = useForm<z.infer<typeof quotationRequestSchema>>({
    defaultValues: {
      userId: user.id,
      quotationId: quotation.quotationId,
      name: user.name || "",
      email: user.email || "",
      phone: "",
      note: "",
    },
  });

  // Calculate
  const calculateSubtotal = () => {
    return quotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item.variant.price) * Number(item.quantity),
      0
    );
  };

  function onSubmit(values: z.infer<typeof quotationRequestSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
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
                    <FormLabel>Phone Number (Optional)</FormLabel>
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
              <h3 className="pb-2 font-semibold">Quotation Summary</h3>
              <QuotationSummaryTable quotation={quotation} />
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
            &quot;Tap on &apos;Request Quotation, &apos; and we &apos;ll provide
            our best price, including any applicable service charges for custom
            requests.&quot;
          </p>
          <Button size="lg">Request Quotation</Button>
        </div>
      </form>
    </Form>
  );
}
