"use server";

import { getQuotationRequest } from "@/lib/data-fetch";
import { prisma } from "@/lib/prisma";
import { generateEmailHTML, zeptoMail } from "@/lib/zepto-mail";
import { revalidatePath } from "next/cache";

export async function respondToQuotationRequest(quotationRequestId: string) {
  const quotationData = await getQuotationRequest(quotationRequestId);
  const htmlContent = generateEmailHTML(
    JSON.parse(JSON.stringify(quotationData))
  );

  // Update the quotation request status to "Responded"
  await prisma.$transaction(async (tx) => {
    return tx.quotationRequest.update({
      where: { id: quotationRequestId },
      data: { status: "Responded" },
    });
  });

  // Send to email
  await zeptoMail.sendMail({
    from: {
      address: "noreply@mail.drxco.dev",
      name: "Silver Rose Hardware",
    },
    to: [
      {
        email_address: {
          address: quotationData?.user.email,
          name: quotationData?.user.name,
        },
      },
    ],
    subject: `Quotation #${quotationData?.quotation.quotationNumber
      .toString()
      .padStart(4, "0")} - Silver Rose Hardware`,
    htmlbody: htmlContent,
  });

  revalidatePath("/quotation/history");
  revalidatePath(`/quotation/history/${quotationRequestId}`);
  revalidatePath("/admin/quotations");
  revalidatePath(`/admin/quotations/view/${quotationRequestId}`);
}
