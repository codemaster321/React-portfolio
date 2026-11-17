import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProcurementDemo from "./ProcurementDemo";

vi.mock("lenis/react", () => ({ useLenis: () => null }));

describe("Procurement workflow preview", () => {
  beforeEach(() => {
    vi.spyOn(window, "matchMedia").mockImplementation((media) => ({
      matches: media === "(prefers-reduced-motion: reduce)", media,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {},
    }));
  });
  afterEach(() => vi.restoreAllMocks());

  it("walks through the example and replays from the original brief", async () => {
    const user = userEvent.setup();
    render(<ProcurementDemo />);
    expect(screen.getByText(/No emails are sent/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Next step/ }));
    expect(screen.getByText("Budget ceiling")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Next step/ }));
    expect(screen.getByText("Delivery outside target")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Next step/ }));
    expect(screen.getByRole("tab", { name: /Recommendation/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/Vendor B costs less/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Replay/ }));
    expect(screen.getByRole("tabpanel", { name: /Requirements/ })).toBeVisible();
  });

  it("supports arrow, Home and End navigation between stages", async () => {
    const user = userEvent.setup();
    render(<ProcurementDemo />);
    screen.getByRole("tab", { name: /Requirements/ }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /RFP/ })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Recommendation/ })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Requirements/ })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Recommendation/ })).toHaveFocus();
  });
});
