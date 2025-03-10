"use client";

import { addQuotationRequestRemark } from "@/app/(server)/actions/quotation-mutations";
import { QuotationItemWithRelations } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };
  return (
    <Card className="rounded-sm shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Remarks</h2>
          <p className="text-sm text-muted-foreground">
            Add important notes or comments about this quotation
          </p>
        </div>
        {!readOnly && (
          <form onSubmit={handleSubmit}>
            <Button
              variant="outline"
              type="submit"
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </form>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter your remarks here..."
            disabled={readOnly}
            className="min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground">
            These remarks will be visible to both you and the customer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
