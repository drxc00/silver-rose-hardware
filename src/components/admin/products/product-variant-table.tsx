"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { addAttribute } from "@/app/(server)/actions/product-mutations";
import { useAction } from "next-safe-action/hooks";
import { SerializedProductWithRelatedData } from "@/app/types";

// Define types
interface Attribute {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AttributeValue {
  id: string;
  value: string;
  name: string;
}

interface Variant {
  id?: string;
  attributes: AttributeValue[];
  price: number;
}

export default function ProductVariantTable({
  attributeList: initialAttributeList,
  setVariants,
  variants,
  product,
}: {
  attributeList: Attribute[];
  setVariants: (variants: Variant[]) => void;
  variants: Variant[];
  product?: SerializedProductWithRelatedData;
}) {
  const [attributeList, setAttributeList] =
    useState<Attribute[]>(initialAttributeList);

  // Current attributes are the attributes that are currently selected
  // Selected attributes are the attributes that are currently selected for the product
  // For example, if the product has 3 attributes, and the user selects 2, the current attributes will be [0, 1]
  // The selected attributes will be [0, 1]
  const [currentAttributes, setCurrentAttributes] = useState<string[]>(
    product?.variants[0].attributes.map((attr) => attr.attributeId) || []
  );

  // For the dialog
  const [isNewAttributeDialogOpen, setIsNewAttributeDialogOpen] =
    useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [pendingColumnIndex, setPendingColumnIndex] = useState<number | null>(
    null
  );
  const { executeAsync, isExecuting } = useAction(addAttribute);

  const addColumn = () => {
    // Add an empty column that will be filled with a selection
    const newAttributeId = "";
    setCurrentAttributes([...currentAttributes, newAttributeId]);

    // Update all variants to include this new attribute
    setVariants(
      variants.map((variant) => {
        const newAttributes = [...variant.attributes];
        newAttributes.push({
          id: newAttributeId,
          name: "",
          value: "",
        });
        return { ...variant, attributes: newAttributes };
      })
    );
  };

  const removeColumn = (index: number) => {
    const newAttributes = [...currentAttributes];
    newAttributes.splice(index, 1);
    setCurrentAttributes(newAttributes);

    // Remove this attribute from all variants
    setVariants(
      variants.map((variant) => {
        const newAttributes = [...variant.attributes];
        newAttributes.splice(index, 1);
        return { ...variant, attributes: newAttributes };
      })
    );
  };

  const updateColumnAttribute = (index: number, attributeId: string) => {
    if (attributeId === "new") {
      setPendingColumnIndex(index);
      setIsNewAttributeDialogOpen(true);
      return;
    }

    // Find the selected attribute to get its name
    const selectedAttribute = attributeList.find(
      (attr) => attr.id === attributeId
    );
    if (!selectedAttribute) return;

    // Update currentAttributes array
    const newCurrentAttributes = [...currentAttributes];
    newCurrentAttributes[index] = attributeId;
    setCurrentAttributes(newCurrentAttributes);

    // Update all variants with the new attribute ID and name
    setVariants(
      variants.map((variant) => {
        const newAttributes = [...variant.attributes];

        // Make sure the attributes array is long enough
        while (newAttributes.length <= index) {
          newAttributes.push({ id: "", name: "", value: "" });
        }

        // Update the attribute at this index with new ID and name
        newAttributes[index] = {
          id: attributeId,
          name: selectedAttribute.name,
          value: newAttributes[index]?.value || "",
        };

        return { ...variant, attributes: newAttributes };
      })
    );
  };

  const addVariant = () => {
    // Create a new variant with the current attributes
    const attributeValues = currentAttributes.map((attributeId, index) => {
      const attribute = attributeList.find((a) => a.id === attributeId);
      return {
        id: attributeId,
        name: attribute?.name || "",
        value: "",
      };
    });

    // Ensure we have an attribute for each column
    while (attributeValues.length < currentAttributes.length) {
      attributeValues.push({ id: "", name: "", value: "" });
    }

    const newVariant = {
      id: "var_" + Date.now(),
      attributes: attributeValues,
      price: 0,
    };

    setVariants([...variants, newVariant]);
  };

  const removeVariant = (variantId: string) => {
    if (!variantId) return;
    setVariants(variants.filter((variant) => variant.id !== variantId));
  };

  const updateVariantValue = (
    variantId: string,
    columnIndex: number,
    value: string
  ) => {
    if (!variantId) return;

    setVariants(
      variants.map((variant) => {
        if (variant.id === variantId) {
          const newAttributes = [...variant.attributes];

          // Ensure the attributes array is long enough
          while (newAttributes.length <= columnIndex) {
            newAttributes.push({ id: "", name: "", value: "" });
          }

          // Only update the value, keep the id and name the same
          newAttributes[columnIndex] = {
            ...newAttributes[columnIndex],
            value,
          };

          return { ...variant, attributes: newAttributes };
        }
        return variant;
      })
    );
  };

  const updateVariantPrice = (variantId: string, price: string) => {
    if (!variantId) return;

    const numPrice = parseFloat(price) || 0;
    setVariants(
      variants.map((variant) =>
        variant.id === variantId ? { ...variant, price: numPrice } : variant
      )
    );
  };

  const handleCreateNewAttribute = async () => {
    if (!newAttributeName.trim()) return;

    try {
      const result = await executeAsync({ name: newAttributeName });

      if (!result?.data?.success) {
        toast({
          title: "Error",
          description:
            result?.data?.message ||
            "Failed to create attribute. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (result?.data?.attribute) {
        const newAttribute = result.data.attribute as unknown as Attribute;

        // Add to attributeList
        setAttributeList([...attributeList, newAttribute]);

        // If we have a pending column index, update that column
        if (pendingColumnIndex !== null) {
          updateColumnAttribute(pendingColumnIndex, newAttribute.id);
          setPendingColumnIndex(null);
        }

        toast({
          title: "Success",
          description: `Attribute "${newAttributeName}" created successfully.`,
        });
      }
    } catch (error) {
      console.error("Error creating new attribute:", error);
      toast({
        title: "Error",
        description: "Failed to create attribute. Please try again.",
        variant: "destructive",
      });
    }

    // Reset and close dialog
    setNewAttributeName("");
    setIsNewAttributeDialogOpen(false);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between w-full">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addColumn}
              className="flex items-center"
              type="button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Attribute Column
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="flex items-center"
              type="button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Variant
            </Button>
          </div>
          {variants.length > 0 && (
            <div>
              <h1 className="text-lg font-medium">
                Variants: {variants.length}
              </h1>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {currentAttributes.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  {currentAttributes.map((attributeId, index) => (
                    <th key={index} className="p-2 border text-left">
                      <div className="flex items-center space-x-2">
                        <Select
                          value={attributeId}
                          onValueChange={(value) =>
                            updateColumnAttribute(index, value)
                          }
                        >
                          <SelectTrigger className="h-8 min-w-[150px]">
                            <SelectValue placeholder="Select attribute" />
                          </SelectTrigger>
                          <SelectContent>
                            {attributeList
                              .filter((attr) => {
                                // Get all selected attributes except the current one
                                const otherSelectedAttributes =
                                  currentAttributes.filter(
                                    (_, i) => i !== index
                                  );
                                // Only show attributes that aren't selected in other columns
                                return !otherSelectedAttributes.includes(
                                  attr.id
                                );
                              })
                              .map((attribute) => (
                                <SelectItem
                                  key={attribute.id}
                                  value={attribute.id}
                                >
                                  {attribute.name}
                                </SelectItem>
                              ))}
                            <SelectItem value="new">
                              + Add new attribute
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColumn(index)}
                          className="h-8 w-8"
                          type="button"
                          aria-label="Remove attribute column"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                  <th className="p-2 border text-left font-medium">
                    <div className="flex items-center">
                      <span className="min-w-[100px]">Price (Php)</span>
                    </div>
                  </th>
                  <th className="p-2 border text-left w-16">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr key={variant.id} className="border-b hover:bg-muted/50">
                    {currentAttributes.map((attributeId, columnIndex) => (
                      <td
                        key={`${variant.id}-${columnIndex}`}
                        className="p-2 border"
                      >
                        <Input
                          type="text"
                          value={variant.attributes[columnIndex]?.value || ""}
                          onChange={(e) =>
                            updateVariantValue(
                              variant.id || "", // Id reference to the variant
                              columnIndex, // Index of the attribute in the variant
                              e.target.value // Value of the attribute input
                            )
                          }
                          className="h-8"
                          placeholder={
                            attributeList.find((a) => a.id === attributeId)
                              ?.name || "Value"
                          }
                          aria-label={`Value for ${
                            attributeList.find((a) => a.id === attributeId)
                              ?.name || "attribute"
                          }`}
                        />
                      </td>
                    ))}
                    <td className="p-2 border">
                      <Input
                        type="text"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariantPrice(variant.id || "", e.target.value)
                        }
                        className="h-8"
                        aria-label="Price for variant"
                        inputMode="decimal"
                      />
                    </td>
                    <td className="p-2 border">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(variant.id || "")}
                        className="h-8 w-8"
                        type="button"
                        aria-label="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentAttributes.length === 0 && (
            <div className="text-center p-4 border rounded bg-muted/20">
              Click &quot;Add Attribute Column&quot; to start creating product
              variants
            </div>
          )}
        </div>
      </div>

      {/* New Attribute Dialog */}
      <Dialog
        open={isNewAttributeDialogOpen}
        onOpenChange={setIsNewAttributeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Attribute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="attribute-name">Attribute Name</Label>
              <Input
                id="attribute-name"
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                placeholder="e.g., Color, Size, Material"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewAttributeDialogOpen(false);
                setPendingColumnIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNewAttribute} disabled={isExecuting}>
              {isExecuting ? "Creating..." : "Create Attribute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <div className="mt-8 p-4 border rounded-md bg-muted/50">
        <h2 className="text-lg font-medium mb-2">Preview</h2>
        <pre className="text-sm overflow-x-auto p-2 bg-background rounded">
          {JSON.stringify(variants, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}
