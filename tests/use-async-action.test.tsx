import { describe, expect, it, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAsyncAction } from "@/features/checkout/hooks/use-async-action";

describe("useAsyncAction", () => {
  it("handles successful execution", async () => {
    const action = vi.fn(async () => {});
    const { result } = renderHook(() => useAsyncAction(action));

    await act(async () => {
      await result.current.execute({ id: "1" });
    });

    expect(action).toHaveBeenCalledWith({ id: "1" });
    expect(result.current.error).toBeNull();
  });

  it("stores error on failure", async () => {
    const action = vi.fn(async () => {
      throw new Error("boom");
    });
    const { result } = renderHook(() => useAsyncAction(action));

    await act(async () => {
      await expect(result.current.execute({} as never)).rejects.toThrow("boom");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("boom");
    });
  });
});
