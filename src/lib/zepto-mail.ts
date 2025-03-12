// @ts-expect-error zeptomail is not offically typed
import { SendMailClient } from "zeptomail";
import { QuotationItemWithRelations } from "@/app/types";
import { formatCurrency } from "./utils";

export const zeptoMail = new SendMailClient({
  url: "api.zeptomail.com/",
  token: process.env.ZEPTO_MAIL_TOKEN,
});

export const generateEmailHTML = (
  quotationData: QuotationItemWithRelations
) => {
  const quotationSubTotal = quotationData?.quotation?.QuotationItem.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.variant?.price),
    0
  );

  const additionalChargesTotal =
    quotationData?.quotation?.AdditionalCharge.reduce(
      (total, charge) => total + Number(charge.amount),
      0
    );

  return `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quotation from Silver Rose Hardware</title>
      <style>
        /* Reset styles for email clients */
        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important; }
        body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        
        /* Basic styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333333;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #e1e1e1;
        }
        
        .header h1 {
          color: #f01111;
          font-size: 24px;
          margin: 0;
          padding: 10px 0;
        }
        
        table {
          width: 100%;
          margin: 20px 0;
        }
        
        th {
          background-color: #f8f9fa;
          padding: 10px;
          text-align: left;
          border: 1px solid #e1e1e1;
        }
        
        td {
          padding: 10px;
          border: 1px solid #e1e1e1;
        }
        
        .text-right {
          text-align: right;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e1e1e1;
          text-align: center;
          font-size: 12px;
          color: #666666;
        }
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Silver Rose Hardware</h1>
            <p>Phone: 8818-8948 8892-5479 | Email: buy@silverrosehardware.com | TELEFAX: 8894-3082</p>
          </div>
            <div>
            <p>Dear ${quotationData.user.name},</p>
                <p>Thank you for reaching out to Silver Rose Hardware! Please find your quotation details below.</p>
            </div>
          <table>
            <tr>
              <td style="width: 50%;">
                <strong>Quotation For:</strong><br>
                ${quotationData.user.name}<br>
                Phone: ${quotationData.phone || ""}<br>
                Email: ${quotationData.user.email}
              </td>
              <td style="width: 50%; text-align: right;">
                <strong>Quotation Details:</strong><br>
                Date: ${new Date(quotationData.createdAt).toDateString()}<br>
                Quotation #: ${quotationData.quotation.quotationNumber
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
              ${quotationData.quotation.QuotationItem.map(
                (item) => `
                <tr>
                  <td>${item.variant?.product.name}</td>
                  <td>
                    <ul style="margin: 0; padding-left: 20px;">
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
  
          <table>
            <tbody>
              ${quotationData.quotation.AdditionalCharge.map(
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
  
          <table style="width: 200px; margin-left: auto;">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">${formatCurrency(
                Number(quotationSubTotal)
              )}</td>
            </tr>
            <tr>
              <td>Additional Charges:</td>
              <td class="text-right">${formatCurrency(
                Number(additionalChargesTotal)
              )}</td>
            </tr>
            <tr style="border-top: 2px solid #e1e1e1; font-weight: bold;">
              <td>Total:</td>
              <td class="text-right">${formatCurrency(
                Number(quotationSubTotal) + Number(additionalChargesTotal)
              )}</td>
            </tr>
          </table>

          ${
            quotationData.remarks
              ? `<div style="background: #fff3cd; padding: 10px; border-left: 5px solid #ffcc00; margin: 20px 0;">
       <strong>Admin Remarks:</strong>
       <p>${quotationData.remarks}</p>
     </div>`
              : ""
          }
  
          <div class="footer">
            <strong>Branches:</strong>
            <p>7627 Dela Rosa St. Makati City 1200</p>
            <p>G-9 & G-10 Rada Regency, Rada cor. Dela Rosa St., Makati City</p>
            <p>G-25 Cityland Makati Executive Tower III, Gil Puyat Ave., Makati City</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
