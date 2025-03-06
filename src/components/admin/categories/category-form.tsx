"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useTransition } from "react";
import { SelectValue } from "@radix-ui/react-select";
import { Category } from "@prisma/client";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { addCategoryFormSchema } from "@/lib/form-schema";
import {
  addCategory,
  updateCategory,
} from "@/app/(server)/actions/category-mutations";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FolderPlus, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AddCategoryFormProps {
  category?: Category;
  categories: Category[];
}

export function CategoryForm({ category, categories }: AddCategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Initialize form
  const form = useForm<z.infer<typeof addCategoryFormSchema>>({
    resolver: zodResolver(addCategoryFormSchema),
    defaultValues: {
      categoryName: category?.name || "",
      parentCategory: category?.parentCategory || "",
      slug: category?.slug || "",
      image: category?.image || "",
    },
  });

  // Watch categoryName for slug generation
  const categoryName = form.watch("categoryName");
  useEffect(() => {
    const generatedSlug = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    form.setValue("slug", generatedSlug);
  }, [categoryName, form]);

  const onSubmit = async (values: z.infer<typeof addCategoryFormSchema>) => {
    startTransition(async () => {
      try {
        if (category) {
          const result = await updateCategory({
            id: category!.id,
            categoryName: values.categoryName,
            slug: values.slug,
            image: values.image as string,
            parentCategory: values.parentCategory,
          });
          // Check the result
          if (!result?.data?.success) {
            throw new Error(result?.data?.message);
          }
          toast({
            title: "Category updated successfully",
            variant: "default",
          });
        } else {
          const result = await addCategory({
            categoryName: values.categoryName,
            slug: values.slug,
            image: values.image as string,
            parentCategory: values.parentCategory,
          });

          if (!result?.data?.success) {
            throw new Error(result?.data?.message);
          }
          router.push("/admin/categories");
          toast({
            title: "Category added successfully",
            variant: "default",
          });
        }
      } catch (error) {
        toast({
          title: "An Error Occurred",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between top-0 z-10 bg-background px-4 py-4 border rounded-sm">
            <Link href="/admin/categories">
              <Button
                variant="outline"
                type="button"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Categories</span>
              </Button>
            </Link>
            <Button type="submit" className="px-6 gap-2" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  <span>{category ? "Updating" : "Adding"} Category...</span>
                </>
              ) : (
                <span>{category ? "Update" : "Add"} Category</span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex h-full flex-col gap-4 top-24">
                <ImageUpload form={form} image={category?.image || ""} />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-sm shadow-none">
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                  <CardDescription>
                    Basic details about your category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category name"
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
                    name="parentCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select a parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs mt-1">
                          Optional. Choose a parent category to create a
                          hierarchy.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="rounded-sm shadow-none">
                <CardContent className="p-6">
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                      {form.watch("slug") || "category-slug"}
                    </div>
                    <FormDescription className="text-xs mt-1">
                      Automatically generated from the category name.
                    </FormDescription>
                  </FormItem>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
