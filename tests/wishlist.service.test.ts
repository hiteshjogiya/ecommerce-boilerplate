import { describe, expect, it } from "vitest";
import { normalizeWishlistProduct, toWishlistItemIds } from "@/src/services/wishlist.service";

describe("wishlist service", () => {
  it("normalizes wishlist rows", () => {
    const normalized = normalizeWishlistProduct({
      id: "w1",
      created_at: "2026-01-01T00:00:00Z",
      products: {
        id: "p1",
        category_id: "c1",
        title: "Product",
        slug: "product",
        description: "desc",
        price: 10,
        compare_price: null,
        stock: 1,
        thumbnail: null,
        featured: false,
        active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    });

    expect(normalized?.wishlist_item_id).toBe("w1");
    expect(normalized?.id).toBe("p1");
  });

  it("maps wishlist item ids", () => {
    const ids = toWishlistItemIds([
      { id: "a", wishlist_item_id: "wa", wishlisted_at: "x" } as never,
      { id: "b", wishlist_item_id: "wb", wishlisted_at: "y" } as never,
    ]);

    expect(ids).toEqual(["a", "b"]);
  });
});
