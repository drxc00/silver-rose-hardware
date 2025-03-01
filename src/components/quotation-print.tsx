"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";

const PrintQuotation = ({ htmlContent }: { htmlContent: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <title>Print Quotation</title>
              <style>
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                }
                  @page { margin: 0; size: auto; }  /* Removes extra blank pages */
        
        /* Reset styles for email clients */
        body { 
                  margin: 0; 
                  padding: 0; 
                  width: 100vw;
                  height: 100vh;
                  overflow: hidden;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
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
                  margin: auto;
                  padding: 20px;
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
              ${htmlContent}
              <script>
                window.onload = () => {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={handlePrint}>
        <Printer />
        <span>Print Quotation</span>
      </Button>
      <iframe ref={iframeRef} style={{ display: "none" }} />
    </div>
  );
};

export default PrintQuotation;
