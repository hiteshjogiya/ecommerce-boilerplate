import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/schemas";

describe("auth schemas", () => {
  it("accepts valid register payload", () => {
    const parsed = registerSchema.safeParse({
      fullName: "Alex Doe",
      email: "alex@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects register payload when passwords mismatch", () => {
    const parsed = registerSchema.safeParse({
      fullName: "Alex Doe",
      email: "alex@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects login payload with invalid email", () => {
    const parsed = loginSchema.safeParse({ email: "bad-email", password: "x" });
    expect(parsed.success).toBe(false);
  });
});
