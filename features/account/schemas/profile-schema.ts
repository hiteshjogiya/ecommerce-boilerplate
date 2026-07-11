import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
