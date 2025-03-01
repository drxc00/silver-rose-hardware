"use client";

import { respondToQuotationRequest } from "@/app/(server)/actions/other-actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MailCheck } from "lucide-react";
import { useTransition } from "react";

export function MailQuotation({
  quotationRequestId,
}: {
  quotationRequestId: string;
}) {
  const [isMailPending, startSendMailTransition] = useTransition();
  const { toast } = useToast();
  return (
    <form
      action={async () => {
        startSendMailTransition(async () => {
          try {
            await respondToQuotationRequest(quotationRequestId);
            // If successful show toast
            toast({
              title: "Success",
              description: "Successfully sent mail to customer",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: (error as Error).message,
              variant: "destructive",
            });
          }
        });
      }}
    >
      <Button>
        <MailCheck />
        <span>
          {isMailPending ? (
            <span className="w-full">
              <Loader2 className="animate-spin" />
            </span>
          ) : (
            "Respond"
          )}
        </span>
      </Button>
    </form>
  );
}
