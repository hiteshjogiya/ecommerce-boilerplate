import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  image: z.string().url().optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
