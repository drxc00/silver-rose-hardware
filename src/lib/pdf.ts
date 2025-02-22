// generateHTMLPDF.ts
import { Prisma } from "@prisma/client";
import { formatCurrency } from "./utils";

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
  const quotationSubTotal = quotationData?.QuotationItem.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.variant.price),
    0
  );

  const additionalChargesTotal = quotationData?.AdditionalCharge.reduce(
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
        @page {
          margin: 0.5cm;
          size: letter;
        }
        
        /* Reset styles for email clients */
        body { 
          margin: 0; 
          padding: 0; 
          min-width: 100%; 
          width: 100% !important; 
          height: 100% !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body, table, td, div, p, a { 
          -webkit-font-smoothing: antialiased; 
          text-size-adjust: 100%; 
          -ms-text-size-adjust: 100%; 
          -webkit-text-size-adjust: 100%; 
          line-height: 1.4;
        }
        
        /* Basic styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #333333;
        }
        
        .container {
          max-width: 800px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          box-shadow: none;
        }
        
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #e1e1e1;
        }
        
        .header h1 {
          color: #ff0000;
          font-size: 28px;
          margin: 0;
          padding: 20px 0;
          font-weight: bold;
        }
        
        table {
          width: 100%;
          margin: 20px 0;
          border-collapse: collapse;
        }
        
        th {
          background-color: #f8f9fa !important;
          padding: 12px;
          text-align: left;
          border: 1px solid #dee2e6;
          color: #333333;
        }
        
        td {
          padding: 12px;
          border: 1px solid #dee2e6;
          vertical-align: top;
        }
        
        .text-right {
          text-align: right;
        }
        
        .specifications ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .specifications li {
          margin-bottom: 4px;
        }
        
        .totals-table {
          width: auto;
          margin-left: auto;
          margin-right: 0;
          min-width: 250px;
        }
        
        .total-row {
          font-weight: bold;
          border-top: 2px solid #dee2e6;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .header h1 {
            color: #ff0000 !important;
          }
          
          th {
            background-color: #f8f9fa !important;
          }
        }
      </style>
      </head>
      <body>
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
                Phone: ${quotationData.QuotationRequest[0].phone || ""}<br>
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
                  <td>${item.variant.product.name}</td>
                  <td class="specifications">
                    <ul>
                      ${item.variant.attributes
                        .map(
                          (attribute) => `
                        <li>${attribute.attribute.name}: ${attribute.value}</li>
                      `
                        )
                        .join("")}
                    </ul>
                  </td>
                  <td>${Number(item.quantity)}</td>
                  <td>${formatCurrency(Number(item.variant.price))}</td>
                  <td class="text-right">${formatCurrency(
                    Number(item.variant.price) * Number(item.quantity)
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
            <tr>
              <td>Additional Charges:</td>
              <td class="text-right">${formatCurrency(
                Number(additionalChargesTotal)
              )}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td class="text-right">${formatCurrency(
                Number(quotationSubTotal) + Number(additionalChargesTotal)
              )}</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
};
