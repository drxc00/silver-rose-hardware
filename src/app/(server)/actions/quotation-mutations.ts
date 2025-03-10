"use server";

import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import {
  additionalChargeShcema,
  quotationRequestSchema,
} from "@/lib/form-schema";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

export async function addAdditionalQuotationCharge({
  payload,
}: {
  payload: z.infer<typeof additionalChargeShcema>;
}) {
  // Check first if there the user is logged in
  // and check if the role is admin
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");
  const user = session?.user;
  if (user?.role !== UserRole.ADMIN) throw new Error("You are not admin.");

  // Parse the payload to match the schema
  const parsedPayload = additionalChargeShcema.safeParse(payload);
  if (!parsedPayload) throw new Error("Invalid Request Payload");
  await prisma.additionalCharge.create({
    data: {
      name: payload.name,
      amount: payload.amount,
      quotationId: payload.quotationId,
    },
  });

  revalidateTag("quotationRequest");
}

export async function addQuotationRequestRemark({
  quotationRequestId,
  remark,
}: {
  quotationRequestId: string;
  remark: string;
}) {
  // Check first if there the user is logged in
  // and check if the role is admin
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");
  const user = session?.user;
  if (user?.role !== UserRole.ADMIN) throw new Error("You are not admin.");

  // Add the remark to the quotation request
  await prisma.quotationRequest.update({
    where: {
      id: quotationRequestId,
    },
    data: {
      remarks: remark,
    },
  });
  revalidatePath(`/admin/quotations/view/${quotationRequestId}`);
}

export async function removeAdditionalQuotationCharge(
  additionalChargeId: string,
  quotationRequestId: string
) {
  if (!additionalChargeId) throw new Error("Invalid Request Payload");
  await prisma.additionalCharge.delete({
    where: {
      id: additionalChargeId,
    },
  });
  revalidatePath(`/admin/quotations/view/${quotationRequestId}`);
  revalidateTag("quotationRequest");
}

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

  revalidatePath("/quotation/history");
  revalidatePath("/admin/quotations");
  revalidateTag("userQuotation");
}

export async function updateQuotationQuantity(
  quotationItemId: string,
  quantity: number
) {
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");

  // Check if the quantity is 0
  // If it is, remove the item from the quotation
  if (quantity === 0) {
    await prisma.quotationItem.delete({
      where: {
        id: quotationItemId,
      },
    });
    revalidateTag("userQuotation");
    return;
  }

  await prisma.quotationItem.update({
    where: {
      id: quotationItemId,
    },
    data: {
      quantity: quantity,
    },
  });
  revalidateTag("userQuotation");
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
    (item) => item?.id === quotationItemId
  );
  if (!quotationItem) throw new Error("Quotation item not found.");
  await prisma.quotationItem.delete({
    where: {
      id: quotationItem.id,
    },
  });
  revalidateTag("userQuotation");
}

export const addQuotationItem = actionClient
  .schema(
    z.object({
      variantId: z.string(),
      quantity: z.number(),
    })
  )
  .action(async ({ parsedInput: { variantId, quantity } }) => {
    try {
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
              QuotationItem: {
                include: {
                  variant: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Check first if the variant exist in the quotation
      const quotationItem = userQuotation?.quotation?.QuotationItem.find(
        (item) => item.variantId === variantId
      );
      if (quotationItem) {
        await prisma.quotationItem.update({
          where: {
            id: quotationItem.id,
          },
          data: {
            quantity: Number(quotationItem.quantity) + quantity,
          },
        });
        // Since the quantity has changed, we need to revalidate the tag
        revalidateTag("userQuotation");
        return {
          success: true,
          message: "Item added to quotation successfully",
        };
      }

      // Perform mutation atomically
      await prisma.$transaction(async (tx) => {
        // Fetch the variant price
        const variant = await tx.variant.findUnique({
          where: { id: variantId },
          select: { price: true },
        });

        if (!variant) {
          throw new Error("Variant not found.");
        }

        // Add the quotation item to the quotation
        await tx.quotationItem.create({
          data: {
            variantId: variantId,
            quantity: quantity,
            quotationId: userQuotation?.quotationId as string,
            priceAtQuotation: variant.price,
          },
        });
      });
    } catch (error) {
      return {
        success: false,
        message: "Failed to add item to quotation: " + (error as Error).message,
      };
    }
    revalidateTag("userQuotation");
    return {
      success: true,
      message: "Item added to quotation successfully",
    };
  });