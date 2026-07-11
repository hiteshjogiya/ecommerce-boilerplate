import { beforeEach, describe, expect, it, vi } from "vitest";

const limit = vi.fn();
const ilike = vi.fn();
const eq = vi.fn();
const order = vi.fn();
const chain = { eq, ilike, order, limit };

eq.mockReturnValue(chain);
ilike.mockReturnValue(chain);
order.mockReturnValue(chain);

const select = vi.fn().mockReturnValue(chain);
const from = vi.fn().mockReturnValue({ select });

vi.mock("next/cache", () => ({ unstable_cache: (fn: (...args: unknown[]) => unknown) => fn }));
vi.mock("@/src/lib/supabase/public", () => ({
  createPublicSupabaseClient: () => ({ from }),
}));

describe("product service", () => {
  beforeEach(() => {
    from.mockClear();
    select.mockClear();
    limit.mockReset();
  });

  it("fetches products", async () => {
    limit.mockResolvedValueOnce({ data: [{ id: "p1", title: "Product" }], error: null });
    const { getProducts } = await import("@/src/services/product.service");

    const result = await getProducts({ limit: 1 });
    expect(Array.isArray(result)).toBe(true);
    expect(from).toHaveBeenCalledWith("products");
  });
});
