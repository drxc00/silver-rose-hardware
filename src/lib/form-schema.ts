import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registrationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const addCategoryFormSchema = z.object({
  categoryName: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  parentCategory: z.string().optional(),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  image: z.string().optional(),
});

// Define better types for the form data structure
export const attributeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  value: z.string(),
});

export const variantSchema = z.object({
  id: z.string().optional(), // Optional for new variants
  price: z.number().positive(),
  attributes: z.array(attributeSchema),
});

export const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  status: z.string(),
  category: z.string(),
  hasVariant: z.boolean(),
  variants: z.array(variantSchema),
});

export const quotationRequestSchema = z.object({
  userId: z.string().min(1),
  userQuotationId: z.string().min(1),
  quotationId: z.string().min(1),
  name: z.string().min(1).min(1),
  email: z.string().email().min(1),
  phone: z.string().min(1),
  note: z.string(),
});

export const additionalChargeShcema = z.object({
  quotationId: z.string().min(1),
  name: z.string().min(1),
  amount: z.number().min(1),
});

export const accountFormSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().min(1),
  username: z.string().min(1),
  password: z.string(),
});
