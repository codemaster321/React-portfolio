import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SystemDiagram from "./SystemDiagram";

describe("Agent workflow explanations", () => {
  it("lets keyboard users select and read a stage before animation is ready", async () => {
    const user = userEvent.setup();
    render(<SystemDiagram ready={false} />);
    const retrieve = screen.getByRole("button", { name: /Retrieve/ });
    retrieve.focus();
    await user.keyboard("{Enter}");
    expect(retrieve).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Bring relevant documents/)).toBeVisible();
    expect(screen.getByRole("button", { name: /Request/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("previews another stage on hover and restores the selected explanation on leave", async () => {
    const user = userEvent.setup();
    render(<SystemDiagram ready={false} />);
    await user.click(screen.getByRole("button", { name: /Retrieve/ }));
    const reason = screen.getByRole("button", { name: /Reason/ });
    await user.hover(reason);
    expect(screen.getByText(/Break the task into steps/)).toBeVisible();
    await user.unhover(reason);
    expect(screen.getByText(/Bring relevant documents/)).toBeVisible();
  });
});
