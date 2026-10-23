import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { buildPageRegistry } from "../../pageRegistry/buildPageRegistry";
import type { PageDefinition } from "../../pageRegistry/types";
import Navigation from "./navigation";

function page(title: string, path: PageDefinition["path"]): PageDefinition {
  return { title, path, component: () => null };
}

const registry = buildPageRegistry({
  "../pages/home/page.ts": page("Home", "/"),
  "../pages/fetchPage/page.ts": page("Fetch", "/fetch"),
  "../pages/hooks/advanced/deep/effect/page.ts": page("Effect", "/effect"),
  "../pages/hooks/basic/page.ts": page("Basic", "/basic"),
});

describe("dynamic navigation", () => {
  it.each([
    { link: "Effect", path: "/EFFECT/", dropdown: "Hooks" },
    { link: "Fetch", path: "/FETCH/", dropdown: null },
  ])("uses the canonical active key for $path", async ({ link, path, dropdown }) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={[path]}>
        <Navigation registry={registry} />
      </MemoryRouter>,
    );

    if (dropdown) {
      const group = screen.getByRole("button", { name: dropdown });
      expect(group).toHaveClass("active");
      await user.click(group);
    }
    const activeLink = screen.getByRole("link", { name: link });
    expect(activeLink).toHaveClass("active");
    expect(activeLink).toHaveAttribute("aria-current", "page");
    if (dropdown) expect(activeLink).toHaveAttribute("aria-selected", "true");
    else expect(activeLink).not.toHaveAttribute("aria-selected");
  });

  it.each([
    { link: "Effect", path: "/EFFECT/details/", dropdown: "Hooks" },
    { link: "Fetch", path: "/FETCH/details/", dropdown: null },
  ])("keeps the parent link inactive at $path", async ({ link, path, dropdown }) => {
    const user = userEvent.setup();
    const prefixRegistry = buildPageRegistry({
      "../pages/home/page.ts": page("Home", "/"),
      "../pages/fetchPage/page.ts": page("Fetch", "/fetch"),
      "../pages/fetchDetailsPage/page.ts": page("Fetch details", "/fetch/details"),
      "../pages/hooks/advanced/deep/effect/page.ts": page("Effect", "/effect"),
      "../pages/hooks/advanced/deep/effectDetails/page.ts": page("Effect details", "/effect/details"),
    });
    render(
      <MemoryRouter initialEntries={[path]}>
        <Navigation registry={prefixRegistry} />
      </MemoryRouter>,
    );

    if (dropdown) await user.click(screen.getByRole("button", { name: dropdown }));
    const parent = screen.getByRole("link", { name: link });
    const activeLink = screen.getByRole("link", { name: `${link} details` });
    expect(parent).not.toHaveClass("active");
    expect(parent).not.toHaveAttribute("aria-current");
    expect(activeLink).toHaveClass("active");
    expect(activeLink).toHaveAttribute("aria-current", "page");
    if (dropdown) {
      expect(parent).toHaveAttribute("aria-selected", "false");
      expect(activeLink).toHaveAttribute("aria-selected", "true");
    } else {
      expect(parent).not.toHaveAttribute("aria-selected");
      expect(activeLink).not.toHaveAttribute("aria-selected");
    }
  });

  it("opens nested groups by click and exposes every descendant as a normal link", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/effect"]}>
        <Navigation registry={registry} />
      </MemoryRouter>,
    );

    const hooks = screen.getByRole("button", { name: "Hooks" });
    expect(hooks).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Effect" })).not.toBeInTheDocument();

    await user.click(hooks);

    const advanced = screen.getByRole("group", { name: "Advanced" });
    const deep = within(advanced).getByRole("group", { name: "Deep" });
    expect(within(deep).getByRole("link", { name: "Effect" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Basic" })).toHaveAttribute("href", "/basic");

    await user.click(screen.getByRole("link", { name: "Basic" }));
    expect(hooks).toHaveAttribute("aria-expanded", "false");
    await user.click(hooks);
    expect(screen.getByRole("link", { name: "Basic" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Effect" })).not.toHaveAttribute("aria-current");
  });

  it("opens with the keyboard, skips subgroup labels, selects links and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navigation registry={registry} />
      </MemoryRouter>,
    );

    const hooks = screen.getByRole("button", { name: "Hooks" });
    hooks.focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("link", { name: "Effect" })).toHaveFocus());

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("link", { name: "Basic" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(hooks).toHaveAttribute("aria-expanded", "false");

    hooks.focus();
    await user.keyboard("{Enter}");
    expect(hooks).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(hooks).toHaveAttribute("aria-expanded", "false");
    expect(hooks).toHaveFocus();
  });

  it.each([
    { link: "Effect", dropdown: "Hooks" },
    { link: "Fetch", dropdown: null },
  ])("collapses the mobile navbar after selecting $link", async ({ link, dropdown }) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navigation registry={registry} />
      </MemoryRouter>,
    );

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    if (dropdown) await user.click(screen.getByRole("button", { name: dropdown }));
    await user.click(screen.getByRole("link", { name: link }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
