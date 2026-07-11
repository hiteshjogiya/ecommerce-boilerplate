import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Authentication",
  description: "Sign in, create an account, and manage secure access.",
  path: "/login",
  noIndex: true,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
