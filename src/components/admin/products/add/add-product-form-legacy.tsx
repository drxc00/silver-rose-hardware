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
  FormDescription,
} from "@/components/ui/form";
import {
  ArrowLeft,
  CirclePlus,
  LoaderIcon,
  Info,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryTree, FormProductVariant } from "@/app/types";
import { VariantDataTable } from "../variant-dt";
import { getVariantDTColumns } from "../variant-dt-columns";
import React from "react";
import { VariantDialog } from "../variant-dialog";
import { Attribute } from "@prisma/client";
import { addProduct } from "@/app/(server)/actions/product-mutations";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductFormProps {
  categories: CategoryTree[];
  attributes: Attribute[];
}

export function AddProductForm({ categories, attributes }: ProductFormProps) {
  const [hasVariant, setHasVariant] = useState(false);
  const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>([]);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  console.log(variants);
  const [variantPrice, setVariantPrice] = useState<number>();

  const { executeAsync, isPending } = useAction(addProduct);

  const form = useForm<z.infer<typeof productFormSchema>>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      status: "visible",
      category: "",
      hasVariant: false,
    },
  });

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, attributes: any, price: number) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index] = { ...updatedVariants[index], attributes, price };
      return updatedVariants;
    });
  };

  const addVariant = (attributes: any, price: any) => {
    setVariants((prevVariants) => [...prevVariants, { attributes, price }]);
  };

  const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
    try {
      if (!data.image || !data.category) {
        throw new Error("Invalid product details. Please try again.");
      }
      const productPayload = {
        ...data,
        hasVariant,
        variants: hasVariant
          ? variants
          : [{ price: variantPrice as number, attributes: [] }],
      };
      const result = await executeAsync(productPayload);
      if (!result?.data?.success) {
        throw new Error(result?.data?.message);
      }
      toast({
        title: "Product added successfully",
        variant: "default",
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Error adding product",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between top-0 z-10 bg-background px-4 py-4 border rounded-sm">
            <Link href="/admin/products">
              <Button
                variant="outline"
                type="button"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to products</span>
              </Button>
            </Link>
            <Button type="submit" className="px-6 gap-2" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  <span>Creating Product...</span>
                </>
              ) : (
                <span>Add Product</span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col gap-4 top-24">
                <ImageUpload form={form} />
                <Card className="rounded-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Product Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">None</SelectItem>
                                <SelectItem value="visible">Visible</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="text-xs mt-2">
                            Control product visibility in your store
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-sm">
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Basic details about your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
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
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            {categories.map((category) => (
                              <React.Fragment key={category.id}>
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <span className="capitalize font-bold">
                                    {category.name}
                                  </span>
                                </SelectItem>
                                {category.subcategories &&
                                  category.subcategories.map((subcat) => (
                                    <SelectItem
                                      key={subcat.id}
                                      value={subcat.id}
                                    >
                                      <span className="capitalize pl-4">
                                        ↳ {subcat.name}
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product"
                            className="min-h-32 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-sm">
                <CardHeader>
                  <CardTitle>Pricing & Variants</CardTitle>
                  <CardDescription>
                    Set up product pricing and variations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TooltipProvider>
                    <FormField
                      control={form.control}
                      name="hasVariant"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <FormLabel className="text-sm font-medium">
                                Product has variants
                              </FormLabel>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-64 text-xs">
                                    Enable this option if your product comes in
                                    multiple variations like sizes, colors, etc.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <FormDescription className="text-xs">
                              {hasVariant
                                ? "Multiple options with different prices"
                                : "Single product with one price"}
                            </FormDescription>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                              setHasVariant(value);
                            }}
                            disabled={isPending || variants.length > 0}
                            aria-readonly
                          />
                        </FormItem>
                      )}
                    />
                  </TooltipProvider>

                  {!hasVariant ? (
                    <div className="p-4 border rounded-md">
                      <FormItem>
                        <Label>Price</Label>
                        <div className="relative mt-1.5">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            className="pl-10"
                            placeholder="0.00"
                            type="number"
                            value={variantPrice}
                            onChange={(e) =>
                              setVariantPrice(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </FormItem>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-sm font-medium">
                          Product Variants
                        </h3>
                        <VariantDialog
                          attributes={attributes}
                          addVariant={addVariant}
                          dialogType="add"
                          isOpen={isVariantDialogOpen}
                          setIsOpen={setIsVariantDialogOpen}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => setIsVariantDialogOpen(true)}
                          className="gap-1"
                        >
                          <CirclePlus className="h-4 w-4" />
                          Add Variant
                        </Button>
                      </div>
                      <div className="p-1">
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
