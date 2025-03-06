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
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, CheckCheck, Loader2 } from "lucide-react";
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
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/categories">
                <Button variant="ghost">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Categories</span>
                </Button>
              </Link>
            </div>
            <Button type="submit" disabled={isPending} className="mt-4">
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCheck />
                  <span>{category ? "Edit" : "Add"} Category</span>
                </div>
              )}
            </Button>
          </div>
          <Card className="w-full rounded-sm shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">Category Details</CardTitle>
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
                        className="bg-sidebar focus-visible:ring-transparent"
                        placeholder="Enter category name"
                        {...field}
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
                    <FormLabel>Parent Category (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-sidebar focus-visible:ring-transparent">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div>
            <ImageUpload form={form} image={category?.image || ""} />
          </div>
        </div>
      </form>
    </Form>
  );
}
