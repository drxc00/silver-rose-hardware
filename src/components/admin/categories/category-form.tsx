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
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { addCategoryFormSchema } from "@/lib/form-schema";
import { addCategory } from "@/app/(server)/actions/category-mutations";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCheck } from "lucide-react";
import Link from "next/link";

interface AddCategoryFormProps {
  categories: Category[];
}

export function AddCategoryForm({ categories }: AddCategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize form
  const form = useForm<z.infer<typeof addCategoryFormSchema>>({
    resolver: zodResolver(addCategoryFormSchema),
    defaultValues: {
      categoryName: "",
      parentCategory: "",
      slug: "",
      image: "",
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
      const response = await addCategory({
        name: values.categoryName,
        slug: values.slug,
        image: values.image as string,
        parentCategory: values.parentCategory,
      });
      if (response.success) {
        router.replace("/admin/categories");
      } else {
        toast({
          title: "Error adding category",
          description: "Please try again later.",
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
            <div className="flex items-center gap-2 pl-2">
              <Link href="/admin/categories">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="font-semibold">Add Category</h1>
            </div>
            <Button type="submit" disabled={isPending} className="mt-4">
              {isPending ? (
                "Adding..."
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCheck />
                  <span>Add Category</span>
                </div>
              )}
            </Button>
          </div>
          <Card className="w-full">
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
            <ImageUpload form={form} />
          </div>
        </div>
      </form>
    </Form>
  );
}
