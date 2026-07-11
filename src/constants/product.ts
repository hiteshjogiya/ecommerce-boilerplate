export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const SORT_TYPES = {
  NEWEST: "newest",
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  FEATURED: "featured",
} as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
} as const;
