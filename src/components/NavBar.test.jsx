import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavBar from "./NavBar";

const lenis = vi.hoisted(() => ({ stop: vi.fn(), start: vi.fn(), scrollTo: vi.fn(), on: vi.fn(), off: vi.fn() }));
vi.mock("lenis/react", () => ({ useLenis: () => lenis }));

function renderNavigation() {
  render(<><NavBar /><main id="main">
    <section id="top" />
    <section id="work" />
    <section id="about" />
    <section id="experience" />
    <section id="contact" />
  </main><div className="footer-reveal" /></>);
}

describe("Section navigation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("restarts scrolling before navigating from the full-screen menu", async () => {
    const user = userEvent.setup();
    renderNavigation();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(lenis.stop).toHaveBeenCalled();
    expect(document.querySelector("#main").inert).toBe(true);
    const mobile = screen.getByRole("navigation", { name: "Portfolio navigation" });
    await user.click(within(mobile).getByRole("button", { name: /About/ }));
    expect(lenis.start.mock.invocationCallOrder[0]).toBeLessThan(lenis.scrollTo.mock.invocationCallOrder[0]);
    expect(lenis.scrollTo).toHaveBeenCalledWith(document.querySelector("#about"), expect.objectContaining({ offset: -84 }));
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
    expect(document.querySelector("#main").inert).not.toBe(true);
  });

  it("closes on Escape and returns keyboard focus to the menu control", async () => {
    const user = userEvent.setup();
    renderNavigation();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const mobile = screen.getByRole("navigation", { name: "Portfolio navigation" });
    expect(within(mobile).getByRole("button", { name: /Work/ })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
  });

  it("traps focus inside the dialog and restores scroll state after closing", async () => {
    const user = userEvent.setup();
    renderNavigation();
    const initialOverflow = document.documentElement.style.overflow;
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog", { name: "Explore portfolio" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.documentElement.style.overflow).toBe("hidden");
    const close = within(dialog).getByRole("button", { name: /Close/ });
    close.focus();
    await user.tab({ shift: true });
    expect(within(dialog).getByRole("link", { name: /shivendrashukla06/ })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.click(close);
    expect(document.documentElement.style.overflow).toBe(initialOverflow);
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("dialog", { name: "Explore portfolio" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(document.querySelector("#main").inert).not.toBe(true);
  });

  it("tracks the section being read without changing it on hover", async () => {
    const user = userEvent.setup();
    renderNavigation();
    ["work", "about", "experience", "contact"].forEach((id, index) => {
      document.getElementById(id).getBoundingClientRect = () => ({ top: (index - 1) * 500, left: 0, width: 100, height: 500 });
    });
    fireEvent.scroll(window);
    const desktop = screen.getByRole("navigation", { name: "Main navigation" });
    const about = within(desktop).getByRole("button", { name: /About/ });
    await waitFor(() => expect(about).toHaveAttribute("aria-current", "location"));
    const contact = within(desktop).getByRole("button", { name: /Contact/ });
    await user.hover(contact);
    expect(about).toHaveAttribute("aria-current", "location");
    expect(contact).not.toHaveAttribute("aria-current");
    document.getElementById("experience").getBoundingClientRect = () => ({ top: 100, left: 0, width: 100, height: 500 });
    fireEvent.scroll(window);
    await waitFor(() => expect(within(desktop).getByRole("button", { name: /Experience/ })).toHaveAttribute("aria-current", "location"));
  });
});
