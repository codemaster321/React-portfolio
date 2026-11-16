import { useState } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillsMap from "./SkillsMap";
import Portfolio from "./Portfolio";

vi.mock("lenis/react", () => ({ useLenis: () => null }));

function ConnectedMap() {
  const [request, setRequest] = useState(null);
  return <><Portfolio projectRequest={request} />
    <SkillsMap onOpenProject={(id) => setRequest({ id })} /></>;
}

describe("Skills map", () => {
  beforeEach(() => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)", media: query,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {},
    }));
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("filters technologies and related work using the keyboard", async () => {
    const user = userEvent.setup();
    render(<SkillsMap />);
    const frontend = screen.getByRole("button", { name: "Frontend" });
    frontend.focus();
    await user.keyboard("{Enter}");
    expect(frontend).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "AI" })).toHaveAttribute("aria-pressed", "false");
    const skills = screen.getByRole("list", { name: "Frontend technologies" });
    expect(within(skills).getByText("React Router")).toBeVisible();
    expect(screen.queryByText("CrewAI")).toBeNull();
    const projects = screen.getByRole("list", { name: "Related case studies" });
    expect(within(projects).getAllByRole("link")).toHaveLength(2);
    expect(within(projects).getByRole("link", { name: /Charvaka/ })).toHaveAttribute("href", "#project-charvaka");
  });

  it("opens and focuses the selected case study, including repeat requests", async () => {
    const user = userEvent.setup();
    render(<ConnectedMap />);
    const projects = screen.getByRole("list", { name: "Related case studies" });
    await user.click(within(projects).getByRole("link", { name: /ModelHub/ }));
    expect(screen.getByRole("heading", { name: "ModelHub / Case study" })).toHaveFocus();
    await user.click(within(projects).getByRole("link", { name: /SleepLog/ }));
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "SleepLog / Case study" })).toHaveFocus();
    await user.click(within(projects).getByRole("link", { name: /SleepLog/ }));
    expect(screen.getByRole("region", { name: "SleepLog / Case study" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "SleepLog / Case study" })).toHaveFocus();
  });
});
