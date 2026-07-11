import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/src/lib/site-config";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { getProducts } from "@/src/services/product.service";
import { getCategories } from "@/src/services/category.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/wishlist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return staticPages;
  }

  try {
    const [products, categories] = await Promise.all([
      getProducts({ limit: 500 }),
      getCategories(),
    ]);

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      lastModified: category.created_at ? new Date(category.created_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...categoryEntries, ...productEntries];
  } catch {
    return staticPages;
  }
}
