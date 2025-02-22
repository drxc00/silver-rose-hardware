// route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import chromium from "@sparticuz/chromium-min";
import * as puppeteer from "puppeteer-core";
import type { Browser, PDFOptions } from "puppeteer-core";
import { generateHTMLPDF } from "@/lib/pdf";

chromium.setGraphicsMode = false;

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance) return browserInstance;

  const isLocal = process.env.LOCAL_CHROME_PATH ? true : false;

  browserInstance = await puppeteer.launch({
    args: isLocal
      ? puppeteer.defaultArgs()
      : [
          ...chromium.args,
          "--hide-scrollbars",
          "--disable-web-security",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--force-color-profile=srgb",
        ],
    defaultViewport: {
      ...chromium.defaultViewport,
      width: 1100,
      height: 1400,
    },
    executablePath:
      process.env.LOCAL_CHROME_PATH || (await chromium.executablePath()),
    headless: chromium.headless as any,
  });

  return browserInstance;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Quotation ID is required" },
        { status: 400 }
      );
    }

    const quotationData = await prisma.quotation.findUnique({
      where: { id },
      include: {
        QuotationItem: {
          include: {
            variant: {
              include: {
                attributes: {
                  include: {
                    attribute: true,
                  },
                },
                product: true,
              },
            },
          },
        },
        AdditionalCharge: true,
        user: true,
        QuotationRequest: true,
      },
    });

    if (!quotationData) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    const html = generateHTMLPDF(JSON.parse(JSON.stringify(quotationData)));
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, {
        waitUntil: ["networkidle0", "load"],
        timeout: 10000,
      });

      const pdfOptions: PDFOptions = {
        format: "Letter",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      };

      // Add these emulation settings for better color reproduction
      await page.emulateMediaType("screen");
      await page.evaluate(() => {
        document
          .querySelector("html")
          ?.setAttribute(
            "style",
            "-webkit-print-color-adjust: exact !important"
          );
      });

      const pdfBuffer = await page.pdf(pdfOptions);

      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=Quotation-${id}.pdf`,
          "Cache-Control": "no-store",
        },
      });
    } finally {
      await page.close();
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
