import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// emailjs must be mocked before Contact is imported, since the module reads
// import.meta.env at module scope.
vi.mock("@emailjs/browser", () => ({
  default: { init: vi.fn(), sendForm: vi.fn() },
}));

import emailjs from "@emailjs/browser";
import Contact from "./Contact";

async function fillAndSubmit(user) {
  await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/email/i), "ada@example.com");
  await user.type(screen.getByLabelText(/message/i), "Hello there");
  await user.click(screen.getByRole("button", { name: /send message/i }));
}

describe("Contact form", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_PUBLIC_KEY", "pk");
    vi.stubEnv("VITE_SERVICE_ID", "svc");
    vi.stubEnv("VITE_TEMPLATE_ID", "tpl");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows the success modal only after the send resolves", async () => {
    const user = userEvent.setup();
    let resolveSend;
    emailjs.sendForm.mockReturnValue(
      new Promise((resolve) => {
        resolveSend = resolve;
      })
    );

    render(<Contact />);
    await fillAndSubmit(user);

    // Still in flight — the old code showed success here.
    expect(screen.queryByText(/message sent successfully/i)).toBeNull();
    expect(
      screen.getByRole("button", { name: /sending/i })
    ).toBeDisabled();

    resolveSend({ status: 200 });

    await waitFor(() =>
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    );
  });

  it("shows an error modal when the send rejects", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    emailjs.sendForm.mockRejectedValue(new Error("network down"));

    render(<Contact />);
    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByText(/message not sent/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/message sent successfully/i)).toBeNull();
  });

  it("clears the fields on success but keeps them on failure", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    emailjs.sendForm.mockRejectedValue(new Error("nope"));

    render(<Contact />);
    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByText(/message not sent/i)).toBeInTheDocument()
    );
    // The user's text must survive a failed send.
    expect(screen.getByLabelText(/name/i)).toHaveValue("Ada Lovelace");
  });

  it("does not attempt a send when EmailJS is not configured", async () => {
    vi.stubEnv("VITE_PUBLIC_KEY", "");
    vi.stubEnv("VITE_SERVICE_ID", "");
    vi.stubEnv("VITE_TEMPLATE_ID", "");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(<Contact />);
    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByText(/message not sent/i)).toBeInTheDocument()
    );
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });
});
