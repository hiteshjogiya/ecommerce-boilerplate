import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export function getServerEnvStatus() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (parsed.success) {
    return { ok: true as const, issues: [] as string[] };
  }

  return {
    ok: false as const,
    issues: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };
}
