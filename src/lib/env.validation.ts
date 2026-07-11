const requiredEnvVars = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
] as const;

let hasValidated = false;

export function validateEnvironment() {
  if (hasValidated) {
    return;
  }

  const missing = requiredEnvVars.filter((key) => {
    const value = process.env[key];
    return !value || value.trim().length === 0;
  });

  hasValidated = true;

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
