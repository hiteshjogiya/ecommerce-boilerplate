import { beforeEach, describe, expect, it, vi } from "vitest";

const updatePayloadSpy = vi.fn();

vi.mock("@/src/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({
    from: () => ({
      update: (payload: unknown) => {
        updatePayloadSpy(payload);
        return {
          eq: () => ({
            select: () => ({
              single: async () => ({ data: { id: "c1", name: "Updated" }, error: null }),
            }),
          }),
        };
      },
    }),
  }),
}));

describe("admin category service", () => {
  beforeEach(() => {
    updatePayloadSpy.mockReset();
  });

  it("updates category without updated_at field", async () => {
    const { updateCategory } = await import("@/src/services/admin-category.service");
    await updateCategory({ id: "c1", name: "Updated" });

    expect(updatePayloadSpy).toHaveBeenCalledWith({ name: "Updated" });
  });
});
