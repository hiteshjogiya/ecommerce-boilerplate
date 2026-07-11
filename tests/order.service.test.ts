import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/src/lib/errors";

const authGetUserMock = vi.fn();
const rpcMock = vi.fn();

vi.mock("@/src/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: authGetUserMock },
    rpc: rpcMock,
  }),
}));

describe("order service", () => {
  beforeEach(() => {
    authGetUserMock.mockReset();
    rpcMock.mockReset();
  });

  it("throws when user is not authenticated", async () => {
    authGetUserMock.mockResolvedValue({ data: { user: null } });
    const { placeOrder } = await import("@/src/services/order.service");

    await expect(
      placeOrder({ addressId: "a1", shippingMethod: "standard", shippingCost: 5, tax: 1, discount: 0 }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("returns order metadata on success", async () => {
    authGetUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    rpcMock.mockResolvedValue({
      data: [{ order_id: "o1", order_number: "ORD-001" }],
      error: null,
    });

    const { placeOrder } = await import("@/src/services/order.service");
    const result = await placeOrder({ addressId: "a1", shippingMethod: "standard", shippingCost: 5, tax: 1, discount: 0 });

    expect(result.orderId).toBe("o1");
    expect(result.orderNumber).toBe("ORD-001");
  });
});
