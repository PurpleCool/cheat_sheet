import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../../app";
import { flattenMenuExample } from "./example";
import * as menuModule from "./flattenMenu";
import flattenMenuSource from "./flattenMenu.ts?raw";
import resultSource from "./result.tsx?raw";
import scenariosSource from "./scenarios.ts?raw";
import { scenarios } from "./scenarios";
import Result from "./result";

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="menu-playground" />),
}));

// Fixture lookup tests the harness without implementing the exercise.
const expectedFor = (items: menuModule.MenuItem[]) => structuredClone(
  scenarios.find(({ input }) => JSON.stringify(input) === JSON.stringify(items))!.expected,
);

afterEach(() => vi.restoreAllMocks());

describe("flattenMenu page", () => {
  it("discovers its route, active Training group and full exercise statement", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/training/flatten-menu"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "flattenMenu" })).toBeVisible();
    const training = screen.getByRole("button", { name: "Training" });
    expect(training).toHaveClass("active");
    await user.click(training);
    const link = screen.getByRole("link", { name: "flattenMenu" });
    expect(link).toHaveAttribute("href", "/training/flatten-menu");
    expect(link).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByText("Условие задачи: Flatten Nested Menu"));
    expect(screen.getByRole("heading", { name: "Дополнительные вопросы после решения" })).toBeVisible();
    expect(screen.getByText("Исходный массив и вложенные объекты нельзя изменять.")).toBeVisible();
  });

  it("displays the exact executable sources and supplies all files to Sandpack", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/training/flatten-menu"]}><App /></MemoryRouter>);
    expect(flattenMenuExample.files).toEqual([
      { path: "flattenMenu.ts", language: "ts", source: flattenMenuSource },
      { path: "scenarios.ts", language: "ts", source: scenariosSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
    ]);
    expect(screen.getByRole("tabpanel").querySelector("code")?.textContent).toBe(flattenMenuSource);
    await user.click(screen.getByRole("tab", { name: "scenarios.ts" }));
    expect(screen.getByRole("tabpanel").querySelector("code")?.textContent).toBe(scenariosSource);
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("menu-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": resultSource, "/flattenMenu.ts": flattenMenuSource, "/scenarios.ts": scenariosSource },
      template: "react-ts",
    }), undefined);
  });

  it("runs repeatedly and compares values independently of object property order", async () => {
    vi.spyOn(menuModule, "default").mockImplementation(items =>
      expectedFor(items).map(({ id, title, depth, parentId }) => ({ depth, parentId, title, id })),
    );
    const user = userEvent.setup();
    render(<Result />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Проверка ещё не запускалась.");
    for (let run = 0; run < 2; run++) {
      await user.click(screen.getByRole("button", { name: "Запустить проверку" }));
      expect(within(status).getAllByText("Пройдено")).toHaveLength(scenarios.length);
      expect(within(status).getAllByText("Входные данные не изменены")).toHaveLength(scenarios.length);
    }
  });

  it("rejects reversed traversal order", async () => {
    vi.spyOn(menuModule, "default").mockImplementation(items => expectedFor(items).reverse());
    const user = userEvent.setup();
    render(<Result />);
    await user.click(screen.getByRole("button", { name: "Запустить проверку" }));
    const rows = within(screen.getByRole("status")).getAllByRole("listitem");
    expect(within(rows[0]).getByText("Не пройдено")).toBeVisible();
  });

  it("detects nested mutation and protects fixtures across repeated runs", async () => {
    const before = structuredClone(scenarios);
    vi.spyOn(menuModule, "default").mockImplementation(items => {
      const expected = expectedFor(items);
      if (items[1]?.children?.[0]) items[1].children[0].title = "Изменено";
      return expected;
    });
    const user = userEvent.setup();
    render(<Result />);
    for (let run = 0; run < 2; run++) {
      await user.click(screen.getByRole("button", { name: "Запустить проверку" }));
      const first = within(screen.getByRole("status")).getAllByRole("listitem")[0];
      expect(within(first).getByText("Не пройдено")).toBeVisible();
      expect(within(first).getByText("Входные данные изменены")).toBeVisible();
      expect(scenarios).toEqual(before);
    }
  });

  it("shows an exception for one scenario and continues checking the others", async () => {
    vi.spyOn(menuModule, "default").mockImplementationOnce(() => {
      throw new Error("Проверочная ошибка");
    }).mockImplementation(expectedFor);
    const user = userEvent.setup();
    render(<Result />);
    await user.click(screen.getByRole("button", { name: "Запустить проверку" }));
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Ошибка: Проверочная ошибка");
    expect(within(status).getAllByText("Пройдено")).toHaveLength(scenarios.length - 1);
  });
});
