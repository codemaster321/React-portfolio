import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "./Portfolio";

vi.mock("lenis/react", () => ({ useLenis: () => null }));

describe("Project case studies", () => {
  beforeEach(() => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it("opens a case study with the keyboard and preserves its repository link", async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    const toggle = screen.getByRole("button", { name: "Read ModelHub case study" });
    toggle.focus();
    await user.keyboard("{Enter}");

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "ModelHub / Case study" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "ModelHub / Case study" })).toHaveFocus();
    expect(screen.getByRole("link", { name: /view repository/i })).toHaveAttribute(
      "href", "https://github.com/codemaster321/ai_modelhub"
    );
    expect(screen.getByText(/Three production verticals:/)).toBeVisible();
  });

  it("closes with Escape and returns focus to the opening control", async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(screen.getByRole("button", { name: "Read SleepLog case study" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("region")).toBeNull();
    const toggle = screen.getByRole("button", { name: "Read SleepLog case study" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("keeps only one study open and offers the live-site link for Charvaka", async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(screen.getByRole("button", { name: "Read ModelHub case study" }));
    await user.click(screen.getByRole("button", { name: "Read Charvaka Recovery case study" }));

    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Charvaka Recovery / Case study" })).toBeVisible();
    expect(screen.getByRole("link", { name: /visit live site/i })).toHaveAttribute(
      "href", "https://charvaka-recovery.vercel.app/"
    );
    await user.click(screen.getByRole("button", { name: /close case study/i }));
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("keeps focus on the newly opened heading when switching backwards", async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(screen.getByRole("button", { name: "Read Charvaka Recovery case study" }));
    await user.click(screen.getByRole("button", { name: "Read ModelHub case study" }));

    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "ModelHub / Case study" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Read Charvaka Recovery case study" })).not.toHaveFocus();
  });

  it("keeps the project header in view instead of jumping down to its case-study heading", async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    vi.spyOn(document.querySelector("#project-modelhub .work__card"), "getBoundingClientRect")
      .mockReturnValue({ top: 160, bottom: 560, height: 400 });
    const heading = document.getElementById("case-title-modelhub");
    vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({
      top: window.innerHeight + 100,
      bottom: window.innerHeight + 140,
      height: 40,
    });

    await user.click(screen.getByRole("button", { name: "Read ModelHub case study" }));

    expect(heading).toHaveFocus();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
