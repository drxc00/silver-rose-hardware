"use server";

import authCache from "@/lib/auth-cache";
import { prisma } from "@/lib/prisma";
import { connect } from "http2";
import { revalidateTag } from "next/cache";

export async function removeQuotationItem(quotationItemId: string) {
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");

  const user = session?.user;
  // Fetch the quotation connected to the user
  const userQuotation = await prisma.userQuotation.findFirst({
    where: {
      userId: user?.id as string,
    },
    include: {
      quotation: {
        include: {
          QuotationItem: true,
        },
      },
    },
  });

  // Check first if the variant exist in the quotation
  const quotationItem = userQuotation?.quotation.QuotationItem.find(
    (item) => item.id === quotationItemId
  );
  if (!quotationItem) throw new Error("Quotation item not found.");
  await prisma.quotationItem.delete({
    where: {
      id: quotationItem.id,
    },
  });
}

export async function addQuotationItem(payload: {
  variantId: string;
  quantity: number;
}) {
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");
  const user = session?.user;
  // Fetch the quotation connected to the user
  const userQuotation = await prisma.userQuotation.findFirst({
    where: {
      userId: user?.id as string,
    },
    include: {
      quotation: {
        include: {
          QuotationItem: true,
        },
      },
    },
  });

  // Check first if the variant exist in the quotation
  const quotationItem = userQuotation?.quotation.QuotationItem.find(
    (item) => item.variantId === payload.variantId
  );
  if (quotationItem) {
    await prisma.quotationItem.update({
      where: {
        id: quotationItem.id,
      },
      data: {
        quantity: Number(quotationItem.quantity) + payload.quantity,
      },
    });
    return;
  }
  // Add the quotation item to the quotation
  await prisma.quotationItem.create({
    data: {
      variantId: payload.variantId,
      quantity: payload.quantity,
      quotationId: userQuotation?.quotationId as string,
    },
  });
}
