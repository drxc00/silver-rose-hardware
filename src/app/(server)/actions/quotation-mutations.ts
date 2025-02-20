"use server";

import authCache from "@/lib/auth-cache";
import { quotationRequestSchema } from "@/lib/form-schema";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function createQuotationRequest(
  payload: z.infer<typeof quotationRequestSchema>
) {
  // Validate the payload
  const parsedPayload = quotationRequestSchema.safeParse(payload);
  if (!parsedPayload) throw new Error("Invalid Request Payload");

  await prisma.$transaction(async (tx) => {
    // Create the quotation request
    await tx.quotationRequest.create({
      data: {
        userId: payload.userId,
        quotationId: payload.quotationId,
        name: payload.name || "",
        customerNote: payload.note || "",
        remarks: "",
        status: "Pending",
        email: payload.email,
      },
    });

    // Remove quotation from user quotation
    await tx.userQuotation.update({
      where: {
        id: payload.userQuotationId,
        userId: payload.userId,
      },
      data: {
        quotationId: null,
      },
    });

    // Create new quotation reference
    await tx.userQuotation.update({
      where: {
        id: payload.userQuotationId,
      },
      data: {
        quotation: {
          create: {
            user: {
              connect: {
                id: payload.userId,
              },
            },
          },
        },
      },
    });
  });
}

export async function updateQuotationQuantity(
  quotationItemId: string,
  quantity: number
) {
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");

  await prisma.quotationItem.update({
    where: {
      id: quotationItemId,
    },
    data: {
      quantity: quantity,
    },
  });
}

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
  const quotationItem = userQuotation?.quotation?.QuotationItem.find(
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
  const quotationItem = userQuotation?.quotation?.QuotationItem.find(
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
