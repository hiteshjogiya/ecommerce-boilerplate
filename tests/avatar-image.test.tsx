import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AvatarImage } from "@/components/ui/avatar-image";

describe("AvatarImage", () => {
  it("renders fallback initial when no src is provided", () => {
    render(<AvatarImage src={null} alt="Avatar" size={20} fallbackLabel="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
