import type { Product } from "@/types/product";

export const navLinks = ["New In", "Women", "Men", "Accessories", "Journal"];

export const heroHighlights = [
  "Free returns",
  "Fast delivery",
  "Sustainably made",
];

export const categories = [
  {
    title: "Everyday Essentials",
    description: "Minimal staples built for comfort and movement.",
    image: "/window.svg",
  },
  {
    title: "Weekend Layers",
    description: "Elevated outerwear and easy silhouettes.",
    image: "/globe.svg",
  },
  {
    title: "Signature Accessories",
    description: "Refined pieces to complete any look.",
    image: "/vercel.svg",
  },
];

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Aero Shell Jacket",
    description: "Weather-ready shell with a tailored, lightweight finish.",
    price: 189,
    originalPrice: 240,
    image: "/window.svg",
    badge: "Best Seller",
    reviews: 124,
  },
  {
    id: "2",
    name: "Contour Tote",
    description: "A structured carryall designed for everyday simplicity.",
    price: 98,
    image: "/globe.svg",
    reviews: 80,
  },
  {
    id: "3",
    name: "Lumen Knit Set",
    description: "Soft knit layers with a premium hand-feel.",
    price: 156,
    image: "/vercel.svg",
    reviews: 64,
  },
  {
    id: "4",
    name: "Studio Loafers",
    description: "Comfort-first form with a polished, sculptural profile.",
    price: 132,
    image: "/next.svg",
    reviews: 95,
  },
];

export const footerColumns = [
  { title: "Shop", links: ["New Arrivals", "Bestsellers", "Accessories"] },
  { title: "Support", links: ["Shipping", "Returns", "Contact"] },
  { title: "Company", links: ["About", "Journal", "Careers"] },
];
