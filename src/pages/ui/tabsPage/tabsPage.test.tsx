import { StrictMode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sandpack } from "@codesandbox/sandpack-react";
import { describe, expect, it, vi } from "vitest";
import appSource from "./app.tsx?raw";
import { tabsExample } from "./example";
import Result from "./result";
import stylesSource from "./styles.css?raw";
import Tabs from "./tabs";
import tabsSource from "./tabs.tsx?raw";
import TabsPage from "./tabsPage";

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="tabs-playground" />),
}));

describe("Tabs page", () => {
  it("keeps the source visible outside the collapsed requirements and explains the original limitations", async () => {
    const user = userEvent.setup();
    render(<TabsPage />);

    const link = screen.getByRole("link", { name: "Источник: GreatFrontEnd — Tabs" });
    expect(link).toHaveAttribute("href", "https://www.greatfrontend.com/questions/user-interface/tabs");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toBeVisible();
    expect(link.closest("details")).toBeNull();
    const summary = screen.getByText("Условие задачи", { selector: "summary" });
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    const attribution = within(details).getByText("Требования изложены своими словами, это не точная копия условия.");
    expect(attribution).not.toBeVisible();
    await user.click(summary);
    expect(attribution).toBeVisible();
    expect(within(details).getAllByRole("listitem")).toHaveLength(3);
    expect(details).toHaveTextContent("начальной активной вкладки");
    expect(details).toHaveTextContent("независимую работу нескольких экземпляров");
    expect(details).toHaveTextContent("клиентский рендеринг допустим");
    await user.click(summary);
    expect(details).not.toHaveAttribute("open");
    expect(link).toBeVisible();
    expect(screen.getByText(tabsExample.notes![0])).toBeVisible();
    expect(screen.getByText(tabsExample.notes![0])).toHaveTextContent("настройки начальной вкладки через props нет");
  });

  it("shows all three exact sources and supplies them to the optional Sandpack", async () => {
    const user = userEvent.setup();
    render(<TabsPage />);
    expect(tabsExample.files).toEqual([
      { path: "app.tsx", language: "tsx", source: appSource },
      { path: "tabs.tsx", language: "tsx", source: tabsSource },
      { path: "styles.css", language: "css", source: stylesSource },
    ]);
    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code.textContent).toBe(appSource);
    for (const [path, source] of [["tabs.tsx", tabsSource], ["styles.css", stylesSource]]) {
      await user.click(screen.getByRole("tab", { name: path }));
      expect(code).toHaveAttribute("data-source-path", path);
      expect(code.textContent).toBe(source);
    }
    expect(screen.queryByTestId("tabs-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("tabs-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": appSource, "/tabs.tsx": tabsSource, "/styles.css": stylesSource },
      template: "react-ts",
    }), undefined);
  });
});

describe("original Tabs implementation", () => {
  it("starts each instance on HTML and keeps selections independent", async () => {
    const user = userEvent.setup();
    render(<><section aria-label="First"><Tabs /></section><section aria-label="Second"><Tabs /></section></>);
    const first = within(screen.getByRole("region", { name: "First" }));
    const second = within(screen.getByRole("region", { name: "Second" }));
    expect(first.getByRole("button", { name: "HTML" })).toHaveClass("active");
    expect(second.getByRole("button", { name: "HTML" })).toHaveClass("active");
    await user.click(first.getByRole("button", { name: "CSS" }));
    expect(first.getByRole("button", { name: "CSS" })).toHaveClass("active");
    expect(first.getByText(/Cascading Style Sheets/)).toBeVisible();
    expect(second.getByRole("button", { name: "HTML" })).toHaveClass("active");
    expect(second.getByText(/The HyperText Markup Language/)).toBeVisible();
  });

  it("supports native Tab traversal and Enter/Space activation without claiming arrow navigation", async () => {
    const user = userEvent.setup();
    render(<Tabs />);
    await user.tab();
    expect(screen.getByRole("button", { name: "HTML" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "CSS" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "CSS" })).toHaveClass("active");
    await user.tab();
    expect(screen.getByRole("button", { name: "JavaScript" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "JavaScript" })).toHaveClass("active");
    expect(screen.getByText(/JavaScript, often abbreviated/)).toBeVisible();
  });
});

describe("Tabs isolated preview", () => {
  it("uses the original isolated stylesheet and switches exactly one paragraph and active button inside the iframe", async () => {
    const { container, rerender } = render(<Result />);
    const frame = screen.getByTitle<HTMLIFrameElement>("Tabs component preview");
    expect(frame).toHaveAttribute("sandbox", "allow-same-origin");
    expect(frame.srcdoc).not.toContain("<script");
    expect(frame.srcdoc).toContain('<html lang="en">');
    expect(frame.contentDocument!.body).toBeEmptyDOMElement();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    fireEvent.load(frame);
    const body = frame.contentDocument!.body;
    const preview = within(body);
    const user = userEvent.setup({ document: frame.contentDocument! });
    expect(body.querySelector("style")!.textContent).toBe(stylesSource);
    expect(container.querySelector("style, button, p")).toBeNull();
    expect(Array.from(document.querySelectorAll("style")).some((style) => style.textContent === stylesSource)).toBe(false);
    expect(preview.getByRole("button", { name: "HTML" })).toHaveClass("active");
    expect(preview.getByText(/The HyperText Markup Language/)).toBeInTheDocument();

    for (const [name, content] of [
      ["CSS", /Cascading Style Sheets/],
      ["JavaScript", /JavaScript, often abbreviated/],
      ["HTML", /The HyperText Markup Language/],
    ] as const) {
      await user.click(preview.getByRole("button", { name }));
      expect(body.querySelectorAll("p")).toHaveLength(1);
      expect(preview.getByText(content)).toBeInTheDocument();
      expect(body.querySelectorAll("button.active")).toHaveLength(1);
      expect(preview.getByRole("button", { name })).toHaveClass("active");
    }

    await user.click(preview.getByRole("button", { name: "CSS" }));
    const selectedButton = preview.getByRole("button", { name: "CSS" });
    rerender(<Result />);
    fireEvent.load(frame);
    expect(screen.getByTitle("Tabs component preview")).toBe(frame);
    expect(preview.getByRole("button", { name: "CSS" })).toBe(selectedButton);
    expect(selectedButton).toHaveClass("active");
    expect(body.querySelectorAll("style")).toHaveLength(1);
    expect(body.querySelectorAll("button")).toHaveLength(3);
  });

  it("handles an unavailable iframe document without leaking into the host", () => {
    const { container } = render(<Result />);
    const frame = screen.getByTitle<HTMLIFrameElement>("Tabs component preview");
    Object.defineProperty(frame, "contentDocument", { configurable: true, value: null });
    expect(() => fireEvent.load(frame)).not.toThrow();
    expect(container.querySelector("style, button, p")).toBeNull();
  });

  it("cleans up the portal on unmount and starts a fresh instance under StrictMode", () => {
    const first = render(<StrictMode><Result /></StrictMode>);
    const frame = screen.getByTitle<HTMLIFrameElement>("Tabs component preview");
    fireEvent.load(frame);
    const oldBody = frame.contentDocument!.body;
    fireEvent.click(within(oldBody).getByRole("button", { name: "CSS" }));
    expect(within(oldBody).getByRole("button", { name: "CSS" })).toHaveClass("active");
    first.unmount();
    expect(oldBody).toBeEmptyDOMElement();

    render(<StrictMode><Result /></StrictMode>);
    const next = screen.getByTitle<HTMLIFrameElement>("Tabs component preview");
    expect(next).not.toBe(frame);
    fireEvent.load(next);
    expect(within(next.contentDocument!.body).getByRole("button", { name: "HTML" })).toHaveClass("active");
    expect(oldBody).toBeEmptyDOMElement();
  });
});
