"use server";

import { getQuotationRequest } from "@/lib/data-fetch";
import { generateEmailHTML, zeptoMail } from "@/lib/zepto-mail";

export async function sendQuotationToEmail(quotationId: string) {
  const quotationData = await getQuotationRequest(quotationId);
  const htmlContent = generateEmailHTML(
    JSON.parse(JSON.stringify(quotationData))
  );

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
}
