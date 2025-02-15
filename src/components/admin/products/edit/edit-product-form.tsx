"use client";

import { Button } from "@/components/ui/button";
import { productFormSchema, variantSchema } from "@/lib/form-schema";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, CirclePlus, LoaderIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "@/components/admin/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CategoryTree,
  FormProductVariant,
  ProductWithRelatedData,
  SerializedProductWithRelatedData,
} from "@/app/types";
import { VariantDataTable } from "../variant-dt";
import { getVariantDTColumns } from "../variant-dt-columns";
import React from "react";
import { VariantDialog } from "../variant-dialog";
import { Attribute } from "@prisma/client";
import { updateProduct } from "@/app/(server)/actions/product-mutations";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductFormProps {
  product: SerializedProductWithRelatedData;
  categories: CategoryTree[];
  attributes: Attribute[];
}

export function EditProductForm({
  product,
  categories,
  attributes,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [hasVariant, setHasVariant] = useState(product.hasVariant || false);
  const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>(
    // We map the variants to the form schema
    product.variants.map(
      (variant) =>
        ({
          id: variant.id,
          price: Number(variant.price),
          attributes: variant.attributes.map((attr) => ({
            id: attr.attribute.id,
            name: attr.attribute.name,
            value: attr.value,
          })),
        } as z.infer<typeof variantSchema>)
    ) || []
  );
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // For products without variants, we create a controlled input
  const [variantPrice, setVariantPrice] = useState<number>();

  const form = useForm<z.infer<typeof productFormSchema>>({
    defaultValues: {
      name: product.name,
      description: product.description || "",
      image: product.image || "",
      status: product.status,
      category: product.categoryId,
      hasVariant: false,
    },
  });

  const removeVariant = (index: number) => {
    // This is based on the index of the state.
    // NOTE: This may have some issues when the state becomes too large-
    // -or some random side effect. Make sure to investigate this further.
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, attributes: any, price: number) => {
    setVariants((prevVariants) => {
      // Get the previous state values
      const updatedVariants = [...prevVariants];
      // Override the values of the indexed element
      updatedVariants[index] = { ...updatedVariants[index], attributes, price };
      return updatedVariants;
    });
  };

  const addVariant = (attributes: any, price: any) => {
    // Simply pushes a new variant to the state
    setVariants((prevVariants) => [...prevVariants, { attributes, price }]);
  };

  const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
    startTransition(async () => {
      try {
        // Validate some fields: image, category
        if (!data.image || !data.category) {
          throw new Error("Invalid product details. Please try again.");
        }
        const productPayload = {
          ...data,
          slug: product.slug,
          hasVariant,
          variants: hasVariant
            ? variants
            : [{ price: variantPrice as number, attributes: [] }],
        };
        await updateProduct(
          product.id,
          productPayload as z.infer<typeof productFormSchema>
        );
      } catch (error) {
        console.log(error);
        toast({
          title: "Error adding product",
          description: (error as Error).message, // This typecasting is so dumb bruh
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/products">
              <Button variant="ghost" type="button">
                <ArrowLeft />
                <span>Back to products</span>
              </Button>
            </Link>
            <Button type="submit">
              {isPending ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <span>Update Product</span>
              )}
            </Button>
          </div>
          <ImageUpload image={product.image || ""} form={form} />
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          {categories.map((category) => (
                            <React.Fragment key={category.id}>
                              <SelectItem key={category.id} value={category.id}>
                                <span className="capitalize font-bold">
                                  {category.name}
                                </span>
                              </SelectItem>
                              {category.subcategories &&
                                category.subcategories.map((subcat) => (
                                  <SelectItem key={subcat.id} value={subcat.id}>
                                    <span className="capitalize">
                                      {subcat.name}
                                    </span>
                                  </SelectItem>
                                ))}
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="visible">Visible</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasVariant"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 ">
                      <FormLabel>Product has Variants</FormLabel>
                      <Switch
                        className="ml-auto"
                        checked={field.value || hasVariant}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          setHasVariant(value);
                        }}
                        disabled={isPending || variants.length > 0} // Disable the switch when the product has variants
                        aria-readonly
                      />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          {!hasVariant ? (
            <Card>
              <CardContent className="p-6">
                <FormItem>
                  <Label>Price</Label>
                  <Input
                    placeholder="₱ 0.00"
                    type="number"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(parseInt(e.target.value))}
                  />
                </FormItem>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Variants</CardTitle>
                <VariantDialog
                  attributes={attributes} // Replace this with actual attributes data
                  addVariant={addVariant}
                  dialogType="add"
                  isOpen={isVariantDialogOpen}
                  setIsOpen={setIsVariantDialogOpen}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsVariantDialogOpen(true)}
                >
                  <CirclePlus className="mr-2" />
                  Add Variant
                </Button>
              </CardHeader>
              <CardContent>
                <VariantDataTable
                  columns={getVariantDTColumns({
                    removeVariant,
                    addVariant,
                    updateVariant,
                    attributes: attributes,
                  })}
                  data={variants as unknown as FormProductVariant[]}
                  removeVariant={removeVariant}
                  addVariant={addVariant}
                  updateVariant={updateVariant}
                  attributes={attributes}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </Form>
  );
}
