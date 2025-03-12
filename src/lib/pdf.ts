// generateHTMLPDF.ts
import { Prisma } from "@prisma/client";
import { formatCurrency } from "./utils";

/*
 *This function generates an HTML string that represents a quotation.
 *It takes a quotation object as an argument and returns an HTML string.
 *The generated HTML string is useds with the puppeteer library to generate a PDF file.
 */
export const generateHTMLPDF = (
  quotationData: Prisma.QuotationGetPayload<{
    include: {
      QuotationItem: {
        include: {
          variant: {
            include: {
              attributes: {
                include: {
                  attribute: true;
                };
              };
              product: true;
            };
          };
        };
      };
      AdditionalCharge: true;
      user: true;
      QuotationRequest: true;
    };
  }>
) => {
  /*
  Calculate the subtotal of the quotation items
  We use the priceAtQuotation field to calculate the total of the quotation items
  Since the price of the product may have changed after the quotation was created
  */
  const quotationSubTotal = quotationData?.QuotationItem.reduce(
    (total, item) =>
      total + Number(item.quantity) * Number(item.priceAtQuotation),
    0
  );
  // Calculate the total of the additional charges
  const additionalChargesTotal = quotationData?.AdditionalCharge.reduce(
    (total, charge) => total + Number(charge.amount),
    0
  );

  return `
        <div class="container">
          <div class="header">
            <h1>Silver Rose Hardware</h1>
            <p>Phone: 8818-8948 8892-5479 | Email: buy@silverrosehardware.com | TELEFAX: 8894-3082</p>
          </div>
          
          <table>
            <tr>
              <td style="width: 50%; border: none;">
                <strong>Quotation For:</strong><br>
                ${quotationData.user.name}<br>
                ${
                  quotationData.QuotationRequest[0]
                    ? "Phone: " +
                      quotationData.QuotationRequest[0].phone +
                      "<br>"
                    : ""
                }
                Email: ${quotationData.user.email}
              </td>
              <td style="width: 50%; text-align: right; border: none;">
                <strong>Quotation Details:</strong><br>
                Date: ${new Date(quotationData.createdAt).toDateString()}<br>
                Quotation #: ${quotationData.quotationNumber
                  .toString()
                  .padStart(4, "0")}
              </td>
            </tr>
          </table>
  
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Specifications</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotationData.QuotationItem.map(
                (item) => `
                <tr>
                  <td>${item.variant?.product.name}</td>
                  <td class="specifications">
                    <ul>
                      ${item.variant?.attributes
                        .map(
                          (attribute) => `
                        <li>${attribute.attribute.name}: ${attribute.value}</li>
                      `
                        )
                        .join("")}
                    </ul>
                  </td>
                  <td>${Number(item.quantity)}</td>
                  <td>${formatCurrency(Number(item.variant?.price))}</td>
                  <td class="text-right">${formatCurrency(
                    Number(item.variant?.price) * Number(item.quantity)
                  )}</td>
                </tr>
              `
              ).join("")}
            </tbody>
          </table>
  
          ${
            quotationData.AdditionalCharge.length > 0
              ? `
            <table>
              <tbody>
                ${quotationData.AdditionalCharge.map(
                  (charge) => `
                  <tr>
                    <td>${charge.name}</td>
                    <td class="text-right">${formatCurrency(
                      Number(charge.amount)
                    )}</td>
                  </tr>
                `
                ).join("")}
              </tbody>
            </table>
          `
              : ""
          }
  
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">${formatCurrency(
                Number(quotationSubTotal)
              )}</td>
            </tr>
            ${
              additionalChargesTotal > 0
                ? `<tr>
              <td>Additional Charges:</td>
              <td class="text-right">${formatCurrency(
                Number(additionalChargesTotal)
              )}</td>
            </tr>`
                : ""
            }
            <tr class="total-row">
              <td>Total:</td>
              <td class="text-right">${formatCurrency(
                Number(quotationSubTotal) + Number(additionalChargesTotal)
              )}</td>
            </tr>
          </table>
        </div>
    `;
};
