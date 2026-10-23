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
    const statement = details!.querySelector("[lang=en]")!;
    expect(statement).not.toBeVisible();
    const note = screen.getByText(debounceExample.notes![0]);
    expect(note).toBeVisible();
    expect(note.closest("details")).toBeNull();

    await user.click(summary);
    expect(details).toHaveAttribute("open");
    expect(statement).toBeVisible();
    expect(Array.from(statement.querySelectorAll("h3"), (heading) => heading.textContent))
      .toEqual(["Arguments", "Returns", "Examples", "Follow-up"]);
    const paragraphs = Array.from(statement.querySelectorAll("p"), (paragraph) =>
      paragraph.textContent!.replace(/\s+/g, " ").trim(),
    );
    expect(paragraphs).toEqual([
      "Debouncing controls how often a function can execute over time. When a JavaScript function is debounced with a wait time of wait milliseconds, it runs only after wait milliseconds have elapsed since the debounced function was last called.",
      'You have probably encountered debouncing in daily life before, such as when entering an elevator. Only after some time passes without pressing the "Door open" button (the debounced function not being called) will the elevator door actually close (the callback function is executed).',
      "Implement debounce(func, wait) so that func is called only after wait milliseconds have passed since the most recent call. The returned function should not invoke func immediately. When the delayed call finally runs, it should use the latest arguments and preserve the this value from the most recent call.",
      "(Function): Returns the debounced function.",
      "debouncedIncrement() is called multiple times.",
    ]);
    expect(Array.from(statement.querySelectorAll("li"), (item) =>
      item.textContent!.replace(/\s+/g, " ").trim(),
    )).toEqual([
      "func (Function): The callback to debounce.",
      "wait (number): The number of milliseconds to wait after the latest call.",
      "Debounce with a cancel() method to cancel delayed invocations and a flush() method to immediately invoke them.",
      "Implement throttle, which is similar to debounce but a little different.",
    ]);
    expect(Array.from(statement.querySelectorAll("pre > code"), (code) => code.textContent))
      .toEqual([
        `let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.

// t = 100: increment() was invoked and i is now 1.`,
        `let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
//  Call debouncedIncrement() again.
debouncedIncrement(); // i = 0

// t = 100: i is still 0 because it has only
//  been 50ms since the last debouncedIncrement() at t = 50.

// t = 150: Because 100ms have passed since
//  the last debouncedIncrement() at t = 50,
//  increment was invoked and i is now 1.`,
      ]);
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
