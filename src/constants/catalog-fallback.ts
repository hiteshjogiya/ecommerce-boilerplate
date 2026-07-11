import type { CategoryRow } from "@/src/services/category.service";
import type { ProductRow } from "@/src/services/product.service";

export interface CatalogFallbackProduct extends ProductRow {
  sku?: string;
  full_description?: string;
  images?: string[];
}

export const fallbackCategories: CategoryRow[] = [
  { id: "cat-1", name: "Everyday Essentials", slug: "everyday-essentials", image: "/window.svg", created_at: "2026-07-11T00:00:00.000Z" },
  { id: "cat-2", name: "Weekend Layers", slug: "weekend-layers", image: "/globe.svg", created_at: "2026-07-11T00:00:00.000Z" },
  { id: "cat-3", name: "Signature Accessories", slug: "signature-accessories", image: "/vercel.svg", created_at: "2026-07-11T00:00:00.000Z" },
];

export const fallbackProducts: CatalogFallbackProduct[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    title: "Aero Shell Jacket",
    slug: "aero-shell-jacket",
    description: "Weather-ready shell with a tailored, lightweight finish.",
    full_description: "A versatile shell jacket built for changing weather, clean layering, and all-day comfort. The tailored cut keeps it polished while the lightweight construction stays easy to wear.",
    price: 189,
    compare_price: 240,
    stock: 12,
    thumbnail: "/window.svg",
    featured: true,
    active: true,
    sku: "NS-1001",
    images: ["/window.svg", "/globe.svg", "/vercel.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    title: "Contour Tote",
    slug: "contour-tote",
    description: "A structured carryall designed for everyday practicality.",
    full_description: "A minimal tote with a structured silhouette, generous interior space, and a refined finish that works from workdays to weekends.",
    price: 98,
    compare_price: 128,
    stock: 8,
    thumbnail: "/globe.svg",
    featured: false,
    active: true,
    sku: "NS-1002",
    images: ["/globe.svg", "/window.svg", "/next.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-3",
    category_id: "cat-2",
    title: "Lumen Knit Set",
    slug: "lumen-knit-set",
    description: "Soft knit layers with a premium hand-feel.",
    full_description: "An elevated knit set with a soft drape, relaxed fit, and versatile styling that makes it an effortless everyday staple.",
    price: 156,
    compare_price: 198,
    stock: 6,
    thumbnail: "/vercel.svg",
    featured: true,
    active: true,
    sku: "NS-1003",
    images: ["/vercel.svg", "/window.svg", "/globe.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-4",
    category_id: "cat-2",
    title: "Studio Loafers",
    slug: "studio-loafers",
    description: "Comfort-first form with a polished, sculptural profile.",
    full_description: "Crafted with a streamlined profile and soft step-in feel, these loafers balance polish and comfort for daily wear.",
    price: 132,
    compare_price: 154,
    stock: 10,
    thumbnail: "/next.svg",
    featured: false,
    active: true,
    sku: "NS-1004",
    images: ["/next.svg", "/globe.svg", "/vercel.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-5",
    category_id: "cat-3",
    title: "Sculpted Tote",
    slug: "sculpted-tote",
    description: "Minimal lines and a polished finish for daily carry.",
    full_description: "A compact carryall with a sculpted shape and clean detailing for a sharp finish on the go.",
    price: 112,
    compare_price: 140,
    stock: 7,
    thumbnail: "/window.svg",
    featured: true,
    active: true,
    sku: "NS-1005",
    images: ["/window.svg", "/next.svg", "/globe.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-6",
    category_id: "cat-3",
    title: "Cloud Knit Cardigan",
    slug: "cloud-knit-cardigan",
    description: "Soft texture and relaxed shape for effortless layering.",
    full_description: "A cozy knit layer with a soft hand-feel and relaxed silhouette that works across seasons and settings.",
    price: 94,
    compare_price: 118,
    stock: 5,
    thumbnail: "/globe.svg",
    featured: false,
    active: true,
    sku: "NS-1006",
    images: ["/globe.svg", "/window.svg", "/vercel.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-7",
    category_id: "cat-3",
    title: "Orbit Sunglasses",
    slug: "orbit-sunglasses",
    description: "Refined silhouettes with a lightweight feel.",
    full_description: "A lightweight frame with refined proportions and all-day wearability for a clean finishing touch.",
    price: 72,
    compare_price: 90,
    stock: 9,
    thumbnail: "/vercel.svg",
    featured: false,
    active: true,
    sku: "NS-1007",
    images: ["/vercel.svg", "/next.svg", "/window.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "prod-8",
    category_id: "cat-2",
    title: "Studio Scarf",
    slug: "studio-scarf",
    description: "A tactile finishing piece designed for cooler days.",
    full_description: "A soft scarf with a tactile finish and easy drape, designed to add warmth without bulk.",
    price: 58,
    compare_price: 74,
    stock: 11,
    thumbnail: "/next.svg",
    featured: false,
    active: true,
    sku: "NS-1008",
    images: ["/next.svg", "/globe.svg", "/window.svg"],
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
];

export function findFallbackProductBySlug(slug: string) {
  return fallbackProducts.find((product) => product.slug === slug) ?? null;
}

export function getFallbackProductsByCategoryId(categoryId: string, excludeId?: string, limit = 4) {
  return fallbackProducts.filter((product) => product.category_id === categoryId && product.id !== excludeId).slice(0, limit);
}

export function getFallbackCategoryBySlug(slug: string) {
  return fallbackCategories.find((category) => category.slug === slug) ?? null;
}
