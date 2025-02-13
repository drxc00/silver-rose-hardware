"use client";

import { FormProductAttribute, FormProductVariant } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { VariantDialog } from "./variant-dialog";

// This file defines the columns for the Variant DataTable component
// It exports a function getVariantDTColumns that returns an array of ColumnDef objects
// Each ColumnDef defines how a column should be rendered and behaves in the table

// The columns include:
// 1. Attributes column - displays product variant attributes in a formatted string
// 2. Price column - displays the variant price
// 3. Actions column - provides dropdown menu with edit/delete actions

// The getVariantDTColumns function takes a removeVariant callback prop
// which is used to handle variant deletion from the table
interface VariantDTColumnsProps {
  removeVariant: (index: number) => void;
  addVariant: (attributes: any, price: number) => void;
}

export const getVariantDTColumns = ({ removeVariant, addVariant }: VariantDTColumnsProps): ColumnDef<FormProductVariant>[] => [
  {
    accessorKey: "attributes",
    header: "Attributes",
    cell: ({ row }) => {
      // Basically conver the attributes to simple string representations
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
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => removeVariant(row.index)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];