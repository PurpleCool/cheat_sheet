import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./app";
import { buildPageRegistry } from "./pageRegistry/buildPageRegistry";
import { pageModules } from "./pageRegistry/registry";

describe("App routing", () => {
  it("discovers the direct Tabs route and active UI group", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/ui/tabs"]}><App /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Tabs" })).toBeVisible();
    const ui = screen.getByRole("button", { name: "UI" });
    expect(ui).toHaveClass("active");
    expect(screen.getByRole("button", { name: "Hooks" })).not.toHaveClass("active");
    await user.click(ui);
    const link = screen.getByRole("link", { name: "Tabs" });
    expect(link).toHaveAttribute("href", "/ui/tabs");
    expect(link).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("heading", { name: "React Cheat Sheet" })).toBeVisible();
    expect(ui).not.toHaveClass("active");
    await user.click(ui);
    await user.click(screen.getByRole("link", { name: "Tabs" }));
    expect(screen.getByRole("heading", { name: "Tabs" })).toBeVisible();
    expect(ui).toHaveClass("active");
    expect(ui).toHaveAttribute("aria-expanded", "false");
  });

  it("discovers Holy Grail and its active Layout group from its page descriptor", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/layout/holy-grail"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Holy Grail" })).toBeVisible();
    const layout = screen.getByRole("button", { name: "Layout" });
    expect(layout).toHaveClass("active");
    expect(screen.getByRole("button", { name: "Hooks" })).not.toHaveClass("active");
    expect(screen.getByRole("button", { name: "Useful" })).not.toHaveClass("active");
    await user.click(layout);
    const link = screen.getByRole("link", { name: "Holy Grail" });
    expect(link).toHaveAttribute("href", "/layout/holy-grail");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
    expect(link).toHaveAttribute("aria-selected", "true");
  });

  it("discovers the direct Debounce route and Useful group from its page descriptor", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/useful/debounce"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Debounce" })).toBeInTheDocument();
    const useful = screen.getByRole("button", { name: "Useful" });
    expect(useful).toHaveClass("active");
    expect(screen.getByRole("button", { name: "Hooks" })).not.toHaveClass("active");
    await user.click(useful);
    const link = screen.getByRole("link", { name: "Debounce" });
    expect(link).toHaveAttribute("href", "/useful/debounce");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
    expect(link).toHaveAttribute("aria-selected", "true");
  });

  it.each([
    ["/useContext", "useContext", "Sharing theme state with useContext"],
    ["/useRef", "useRef", "Counting renders with useRef"],
  ])("renders direct %s with the active lesson and group", async (path, title, heading) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hooks" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");

    await user.click(screen.getByRole("button", { name: "Hooks" }));

    expect(screen.getByRole("link", { name: title })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: title })).toHaveAttribute("href", path);
    expect(screen.getByRole("link", { name: title })).toHaveClass("active");
    expect(screen.getByRole("link", { name: title })).toHaveAttribute("aria-selected", "true");
  });

  it("switches lessons and home, updating active links without reloading", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/useContext"]}>
        <App />
      </MemoryRouter>,
    );

    const hooks = screen.getByRole("button", { name: "Hooks" });
    await user.click(hooks);
    await user.click(screen.getByRole("link", { name: "useRef" }));

    expect(screen.getByRole("heading", { name: "Counting renders with useRef" })).toBeInTheDocument();
    expect(hooks).toHaveAttribute("aria-expanded", "false");

    await user.click(hooks);
    expect(screen.getByRole("link", { name: "useRef" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "useRef" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "useRef" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("link", { name: "useContext" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "useContext" })).not.toHaveClass("active");
    expect(screen.getByRole("link", { name: "useContext" })).toHaveAttribute("aria-selected", "false");
    await user.click(hooks);

    await user.click(screen.getByRole("link", { name: "Home" }));

    expect(
      screen.getByRole("heading", { name: "React Cheat Sheet" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(hooks).not.toHaveClass("active");

    await user.click(hooks);
    expect(screen.getByRole("link", { name: "useRef" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "useRef" })).not.toHaveClass("active");
    expect(screen.getByRole("link", { name: "useRef" })).toHaveAttribute("aria-selected", "false");
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
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("adds a future root page to both header and routes from injected modules alone", async () => {
    const user = userEvent.setup();
    const registry = buildPageRegistry({
      ...pageModules,
      "../pages/fetchPage/page.ts": {
        title: "Fetch",
        path: "/fetch",
        component: () => <h1>Fetch lesson</h1>,
      },
    });
    render(
      <MemoryRouter>
        <App registry={registry} />
      </MemoryRouter>,
    );

    const fetch = screen.getByRole("link", { name: "Fetch" });
    expect(fetch).toHaveAttribute("href", "/fetch");
    expect(fetch).not.toHaveAttribute("aria-current");
    expect(fetch).not.toHaveClass("active");
    expect(fetch).not.toHaveAttribute("aria-selected");
    await user.click(fetch);

    expect(screen.getByRole("heading", { name: "Fetch lesson" })).toBeInTheDocument();
    expect(fetch).toHaveAttribute("aria-current", "page");
    expect(fetch).toHaveClass("active");
    expect(fetch).not.toHaveAttribute("aria-selected");
    expect(screen.getByRole("button", { name: "Hooks" })).not.toHaveClass("active");

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("heading", { name: "React Cheat Sheet" })).toBeInTheDocument();
    expect(fetch).not.toHaveAttribute("aria-current");
    expect(fetch).not.toHaveClass("active");
    expect(fetch).not.toHaveAttribute("aria-selected");
  });
});
