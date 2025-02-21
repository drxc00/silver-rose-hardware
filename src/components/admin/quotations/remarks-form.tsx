"use client";

import { addQuotationRequestRemark } from "@/app/(server)/actions/quotation-mutations";
import { QuotationItemWithRelations } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

interface RemarksFormProps {
  quotationRequest: QuotationItemWithRelations;
  readOnly?: boolean;
}

export function RemarksForm({
  quotationRequest,
  readOnly = false,
}: RemarksFormProps) {
  const [remarks, setRemarks] = useState(quotationRequest.remarks || "");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Card className="rounded-t-none border-t-none">
      <CardHeader className="flex flex-row w-full items-center justify-between p-6">
        <h1 className="text-xl font-semibold">Remarks</h1>
        {!readOnly && (
          <form
            action={async () => {
              if (!remarks || remarks === "") {
                toast({
                  title: "Error",
                  description: "Please enter remarks",
                });
                return;
              }
              startTransition(async () => {
                await addQuotationRequestRemark({
                  quotationRequestId: quotationRequest.id,
                  remark: remarks,
                });
              });
            }}
          >
            <Button variant="outline" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        )}
      </CardHeader>
      <CardContent className="px-6">
        <Textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks"
          disabled={readOnly}
        />
      </CardContent>
    </Card>
  );
}
