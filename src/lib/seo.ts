import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_SUFFIX, getSiteUrl } from "@/src/lib/site-config";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    path = "/",
    image = "/window.svg",
    noIndex = false,
    type = "website",
  } = options;

  const resolvedTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`;
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl("/favicon.ico"),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface ProductJsonLdInput {
  name: string;
  description: string;
  image: string;
  sku?: string | null;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock";
  url: string;
  ratingValue?: number;
  reviewCount?: number;
  category?: string;
}

export function buildProductJsonLd(input: ProductJsonLdInput) {
  const imageUrl = input.image.startsWith("http") ? input.image : absoluteUrl(input.image);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: [imageUrl],
    sku: input.sku ?? undefined,
    category: input.category,
    offers: {
      "@type": "Offer",
      priceCurrency: input.currency ?? "USD",
      price: input.price.toFixed(2),
      availability: `https://schema.org/${input.availability}`,
      url: input.url,
    },
    aggregateRating:
      input.ratingValue && input.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: input.ratingValue,
            reviewCount: input.reviewCount,
          }
        : undefined,
  };
}

export function buildCategoryJsonLd(input: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
  };
}
