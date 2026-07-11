import { z } from "zod";

export const productSchema = z.object({
  category_id: z.string().uuid("Category is required"),
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is too short"),
  price: z.number().nonnegative(),
  compare_price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
