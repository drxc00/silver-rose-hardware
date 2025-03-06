"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CirclePlus, Plus, ArrowLeft, X, LoaderIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Attribute } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addAttribute } from "@/app/(server)/actions/product-mutations";
import { z } from "zod";
import { attributeSchema } from "@/lib/form-schema";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";

export type FormAttributeValues = {
  attributeId?: string;
  name: string;
  value: string;
};

export function VariantDialog({
  isOpen,
  setIsOpen,
  attributes, // All attributes in the database
  attributeValues, // The attributes of the variant
  addVariant,
  updateVariant,
  dialogType = "add",
  index,
  variantPrice,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  attributes: Attribute[];
  attributeValues?: z.infer<typeof attributeSchema>[];
  addVariant?: Function;
  dialogType: "add" | "update";
  updateVariant?: Function;
  index?: number;
  variantPrice?: number;
}) {
  const [attrLoading, setAttrLoading] = useState(false);

  const [variantAttributes, setVariantAttributes] = useState<
    z.infer<typeof attributeSchema>[]
  >(attributeValues || []);
  const [price, setPrice] = useState<number>(variantPrice || 0);
  const [attributeValue, setAttributeValue] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(
    null
  );
  const [createNewAttribute, setCreateNewAttribute] = useState(false);
  const [newAttribute, setNewAttribute] = useState("");
  const { toast } = useToast();

  const resetInputs = () => {
    setNewAttribute("");
    setAttributeValue("");
  };

  const addVariantAttribute = async () => {
    // Check if the the state is in the new attribute state..
    if (newAttribute) {
      try {
        // Validate the inputs first
        if (!newAttribute || !attributeValue) {
          toast({
            title: "Error",
            description: "Please fill in all the required fields.",
            variant: "destructive",
          });
          return;
        }

        // Invoke the server action to add the attribute
        setAttrLoading(true);
        const newlyAddedAttribute = await addAttribute(newAttribute);
        setAttrLoading(false);
        setVariantAttributes([
          ...variantAttributes,
          {
            id: newlyAddedAttribute.id as string,
            name: newAttribute,
            value: attributeValue,
          },
        ]);
      } catch (err) {
        // Validate the inputs first
        toast({
          title: "Error",
          description:
            "There was an error adding the attribute. Please try again: " +
            (err as Error).name,
          variant: "destructive",
        });
      }
    } else {
      // Validate the inputs first
      if (!selectedAttribute || !attributeValue) {
        toast({
          title: "Error",
          description: "Please fill in all the required fields.",
          variant: "destructive",
        });
        return;
      }
      // Find the selected attribute in the attributes
      const selectedAttr = attributes.find(
        (attr) => attr.name === selectedAttribute
      );
      setVariantAttributes([
        ...variantAttributes,
        {
          id: selectedAttr?.id,
          name: selectedAttribute as string,
          value: attributeValue,
        },
      ]);
    }
    resetInputs();
  };

  const removeVariantAttribute = (index: number) => {
    const newVariantAttributes = [...variantAttributes];
    // Simply performs a slice operation
    // Removes the attribute from the state array, fyck u
    newVariantAttributes.splice(index, 1);
    setVariantAttributes(newVariantAttributes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Variant</DialogTitle>
          <DialogDescription className="sr-only">
            Dialog for adding or updating a variant
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label className="font-bold">Price</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="₱ 0.00"
              className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
          <div>
            <ScrollArea className="h-72 border-b">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary border-none rounded-md">
                  <TableRow>
                    <TableHead>Attribute</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {variantAttributes && variantAttributes.length > 0 ? (
                  <TableBody>
                    {variantAttributes.map((attr, index) => (
                      <TableRow key={index} className="border-b">
                        <TableCell>{attr.name}</TableCell>
                        <TableCell>{attr.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => removeVariantAttribute(index)}
                          >
                            <X />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No Attributes
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </ScrollArea>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {!createNewAttribute ? (
              <Select
                onValueChange={(value) => {
                  if (value === "New") {
                    setCreateNewAttribute(true);
                    setSelectedAttribute(null);
                  } else {
                    // Simply displays the selected one to hide the ID.
                    // A bit tedious but it works
                    const selectedAttr = attributes.find(
                      (attr) => attr.id === value
                    );
                    setSelectedAttribute(selectedAttr?.name || null);
                    setCreateNewAttribute(false);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Attribute" />
                </SelectTrigger>
                <SelectContent>
                  {/**
                   * We need to filter out the attributes that are already added
                   * This prevents duplicates of attributes
                   */}
                  {attributes &&
                    attributes
                      .filter((attr) => {
                        const found = variantAttributes.find(
                          (variantAttr) => variantAttr.id === attr.id
                        );
                        if (found) return false;
                        return true;
                      })
                      .map((attr) => (
                        <SelectItem key={attr.id} value={attr.id}>
                          {attr.name}
                        </SelectItem>
                      ))}
                  <SelectItem value="New">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>New Attribute</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2 items-center w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCreateNewAttribute(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Input
                  className="flex-1"
                  placeholder="Attribute Name"
                  value={newAttribute}
                  onChange={(e) => setNewAttribute(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Value"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={addVariantAttribute}
                disabled={selectedAttribute === null}
              >
                {attrLoading ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <CirclePlus />
                )}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedAttribute === null && !attributeValues}
            onClick={() => {
              if (dialogType === "add" && addVariant) {
                addVariant(variantAttributes, price);
              } else if (dialogType === "update" && updateVariant) {
                updateVariant(index, variantAttributes, price);
              }

              setVariantAttributes(attributeValues || []);
              setPrice(variantPrice || 0);
              setAttributeValue("");
              setSelectedAttribute(null);
              setCreateNewAttribute(false);
              setNewAttribute("");

              setIsOpen(false);
            }}
          >
            {dialogType === "add" ? "Add Variant" : "Update Variant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
