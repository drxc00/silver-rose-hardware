"use client";

import { FormProductVariant } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { VariantDialog } from "./variant-dialog";
import { Attribute } from "@prisma/client";
import { attributeSchema } from "@/lib/form-schema";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VariantDTColumnsProps {
  removeVariant: (index: number) => void;
  addVariant: (attributes: any, price: number) => void;
  updateVariant: (index: number, attributes: any, price: number) => void;
  attributes: Attribute[];
  attributeValues?: z.infer<typeof attributeSchema>[];
}

export const getVariantDTColumns = ({
  removeVariant,
  updateVariant,
  attributes,
}: VariantDTColumnsProps): ColumnDef<FormProductVariant>[] => [
  {
    accessorKey: "attributes",
    header: "Attributes",
    cell: ({ row }) => {
      // Basically convert the attributes to simple string representations
      const attributeNameValue = row.original.attributes.reduce(
        (attrString, attr) => {
          const nameValueString = attr.name + ":" + attr.value + ";" + "\n";
          return attrString + nameValueString;
        },
        ""
      );

      return (
        <div>
          <p className="truncate">{attributeNameValue}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span>₱ {Number(row.original.price).toFixed(2)}</span>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsComponent
        {...{ removeVariant, updateVariant, row, attributes }}
      />
    ),
  },
];

function ActionsComponent({
  removeVariant,
  updateVariant,
  row,
  attributes,
}: {
  removeVariant: (index: number) => void;
  updateVariant: (index: number, attributes: any, price: number) => void;
  row: Row<FormProductVariant>;
  attributes: Attribute[];
}) {
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  return (
    <>
      <VariantDialog
        updateVariant={updateVariant}
        dialogType="update"
        index={row.index}
        attributes={attributes}
        attributeValues={row.original.attributes}
        variantPrice={row.original.price}
        isOpen={isVariantDialogOpen}
        setIsOpen={setIsVariantDialogOpen}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsVariantDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => removeVariant(row.index)}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
