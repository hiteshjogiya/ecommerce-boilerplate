import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingleMock = vi.fn();
const singleMock = vi.fn();
const selectMock = vi.fn(() => ({
  eq: vi.fn(() => ({
    eq: vi.fn(() => ({
      maybeSingle: maybeSingleMock,
    })),
    single: singleMock,
  })),
}));

const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock("@/src/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({ from: fromMock }),
}));

describe("coupon service", () => {
  beforeEach(() => {
    maybeSingleMock.mockReset();
    singleMock.mockReset();
    fromMock.mockClear();
  });

  it("returns invalid when coupon is missing", async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const { validateCoupon } = await import("@/src/services/coupon.service");

    const result = await validateCoupon("SAVE10", "u1", 100);
    expect(result.valid).toBe(false);
  });
});
