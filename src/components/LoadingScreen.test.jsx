import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

describe("Intro visibility", () => {
  beforeEach(() => {
    sessionStorage.clear();
    delete window.__loadingComplete;
    vi.spyOn(window, "matchMedia").mockImplementation((media) => ({
      matches: media === "(max-width: 900px)", media,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {},
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
    delete window.__loadingComplete;
  });

  it("plays on a fresh mobile session and records completion", async () => {
    const { container } = render(<><LoadingScreen /><span data-intro-brand>Shivendra Shukla</span></>);
    expect(container.querySelector(".intro__name")).toHaveTextContent("Shivendra Shukla");
    await waitFor(() => expect(container.querySelector(".intro")).toBeNull(), { timeout: 2500 });
    expect(sessionStorage.getItem("portfolio-intro-seen")).toBe("1");
    expect(window.__loadingComplete).toBe(true);
  });

  it("skips a repeat visit within the same session", () => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    const { container } = render(<LoadingScreen />);
    expect(container.querySelector(".intro")).toBeNull();
    expect(window.__loadingComplete).toBe(true);
  });

  it("respects reduced motion even in a fresh session", () => {
    window.matchMedia.mockImplementation((media) => ({ matches: true, media }));
    const { container } = render(<LoadingScreen />);
    expect(container.querySelector(".intro")).toBeNull();
    expect(window.__loadingComplete).toBe(true);
  });
});
