import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./app";

vi.mock("react-codepen-embed", () => ({
  default: () => <div data-testid="codepen-embed" />,
}));

describe("App routing", () => {
  it("renders direct lesson routes and navigates without reloading", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/useContext"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Sharing theme state with useContext",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Home" }));

    expect(
      screen.getByRole("heading", { name: "React Cheat Sheet" }),
    ).toBeInTheDocument();
  });

  it("redirects unknown routes to home", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "React Cheat Sheet" }),
    ).toBeInTheDocument();
  });
});
