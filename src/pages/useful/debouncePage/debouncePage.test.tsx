import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import DebouncePage from "./debouncePage";
import { debounceExample } from "./example";

describe("Debounce page", () => {
  it("shows the source and limitation outside the initially closed local statement", async () => {
    const user = userEvent.setup();
    render(<DebouncePage />);

    expect(screen.getByRole("heading", { name: "Debounce" })).toBeVisible();
    const link = screen.getByRole("link", { name: "Источник: GreatFrontEnd — Debounce" });
    expect(link).toHaveAttribute("href", "https://www.greatfrontend.com/questions/javascript/debounce");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toBeVisible();
    expect(link.closest("details")).toBeNull();

    const summary = screen.getByText("Условие задачи", { selector: "summary" });
    const details = summary.closest("details");
    expect(details).not.toHaveAttribute("open");
    const statement = screen.getByText("Пересказ условия.");
    expect(statement).not.toBeVisible();
    const note = screen.getByText(debounceExample.notes![0]);
    expect(note).toBeVisible();
    expect(note.closest("details")).toBeNull();

    await user.click(summary);
    expect(details).toHaveAttribute("open");
    expect(statement).toBeVisible();
    expect(details).toHaveTextContent("this последнего обращения");
    expect(details).toHaveTextContent("cancel()");
    expect(details).toHaveTextContent("flush()");
    await user.click(summary);
    expect(details).not.toHaveAttribute("open");
    expect(link).toBeVisible();
  });

  it("displays the actual algorithm and demo sources used by the entry and playground", async () => {
    const user = userEvent.setup();
    render(<DebouncePage />);

    const code = screen.getByRole("tabpanel").querySelector("code");
    expect(code).toHaveAttribute("data-source-path", "debounce.ts");
    expect(code?.textContent).toBe(debounceExample.files[0].source);
    await user.click(screen.getByRole("tab", { name: "result.tsx" }));
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code?.textContent).toBe(debounceExample.files[1].source);
    expect(screen.getByRole("region", { name: "Демонстрация debounce" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Edit in playground" })).toBeVisible();
  });
});
