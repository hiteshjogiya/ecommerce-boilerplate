import type { CategoryRow } from "@/src/services/category.service";
import type { ProductRow } from "@/src/services/product.service";

export type ProductDetailRecord = ProductRow & {
  sku?: string | null;
  full_description?: string | null;
  images?: string[] | null;
  categories?: CategoryRow | null;
};

export function isValidProductSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function getProductCategoryName(product: ProductDetailRecord) {
  return product.categories?.name ?? "Uncategorized";
}

export function getProductCategorySlug(product: ProductDetailRecord) {
  return product.categories?.slug ?? "";
}

export function getDiscountPercentage(price: number, comparePrice?: number | null) {
  if (!comparePrice || comparePrice <= price) {
    return 0;
  }

  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function buildProductGalleryImages(product: ProductDetailRecord) {
  const primaryImage = product.thumbnail ?? "/window.svg";
  const candidateImages = [primaryImage, ...(product.images ?? [])].filter(Boolean) as string[];
  const uniqueImages = Array.from(new Set(candidateImages));

  if (uniqueImages.length >= 3) {
    return uniqueImages;
  }

  const fallbackImages = ["/window.svg", "/globe.svg", "/vercel.svg", "/next.svg"];
  for (const image of fallbackImages) {
    if (uniqueImages.length >= 4) {
      break;
    }

    if (!uniqueImages.includes(image)) {
      uniqueImages.push(image);
    }
  }

  return uniqueImages;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}
