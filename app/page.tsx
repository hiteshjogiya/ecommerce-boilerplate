import type { Metadata } from "next";
import { MainShell } from "@/components/layout/main-shell";
import HomePage from "@/features/home/home-page";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description: "Discover curated apparel, accessories, and home essentials with a fast, modern shopping experience.",
  path: "/",
});

export const revalidate = 300;

export default function Home() {
  return (
    <MainShell>
      <HomePage />
    </MainShell>
  );
}
