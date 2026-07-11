export const SITE_NAME = "Northstar";
export const SITE_TITLE_SUFFIX = "Premium E-Commerce";
export const SITE_DESCRIPTION = "Premium e-commerce experience for modern essentials, accessories, and curated lifestyle goods.";

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!envUrl) {
    return "http://localhost:3000";
  }

  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
}
