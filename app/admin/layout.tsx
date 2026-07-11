import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Admin dashboard and catalog management tools.",
  path: "/admin",
  noIndex: true,
});

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
