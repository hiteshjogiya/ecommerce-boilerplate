import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(1, 'Slug is required').min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  category_id: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  compare_price: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock must be 0 or greater'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  image_url: z.string().url().optional().or(z.literal('')),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(1, 'Slug is required').min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  image_url: z.string().url().optional().or(z.literal('')),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
