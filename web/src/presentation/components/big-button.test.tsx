import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BigButton } from "@/presentation/components/big-button";

describe("BigButton", () => {
  it("renders children", () => {
    render(<BigButton>Salvar</BigButton>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });
});
