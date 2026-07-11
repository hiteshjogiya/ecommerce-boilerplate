import { describe, expect, it } from "vitest";
import {
  buildCartLineItem,
  calculateCartTotals,
  clampCartQuantity,
  mergeCartLineItems,
  upsertCartLineItem,
} from "@/src/services/cart.service";

describe("cart service", () => {
  it("clamps quantity by stock", () => {
    expect(clampCartQuantity(0, 2)).toBe(1);
    expect(clampCartQuantity(5, 2)).toBe(2);
  });

  it("builds a valid line item", () => {
    const item = buildCartLineItem(
      {
        id: "p1",
        slug: "shirt",
        title: "Shirt",
        description: "Soft shirt",
        price: 20,
        compare_price: 25,
        stock: 3,
        thumbnail: null,
        active: true,
      },
      2,
    );

    expect(item.productId).toBe("p1");
    expect(item.quantity).toBe(2);
    expect(item.image).toBe("/window.svg");
  });

  it("upserts and merges items", () => {
    const a = buildCartLineItem({ id: "a", title: "A", description: "A", price: 10, compare_price: null, stock: 3, thumbnail: null, active: true }, 1);
    const b = buildCartLineItem({ id: "b", title: "B", description: "B", price: 5, compare_price: null, stock: 2, thumbnail: null, active: true }, 1);
    const next = upsertCartLineItem([a], b);

    expect(next.map((x) => x.productId)).toEqual(["b", "a"]);

    const merged = mergeCartLineItems([a], [buildCartLineItem({ id: "a", title: "A", description: "A", price: 10, compare_price: null, stock: 3, thumbnail: null, active: true }, 2)]);
    expect(merged[0].quantity).toBe(3);
  });

  it("calculates totals", () => {
    const item = buildCartLineItem({ id: "a", title: "A", description: "A", price: 50, compare_price: null, stock: 5, thumbnail: null, active: true }, 2);
    const totals = calculateCartTotals([item]);

    expect(totals.subtotal).toBe(100);
    expect(totals.shipping).toBe(0);
    expect(totals.totalQuantity).toBe(2);
  });
});
