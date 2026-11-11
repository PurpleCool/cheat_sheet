import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../../../app";
import { getUserStatsExample } from "./example";
import getUserStatsSource from "./getUserStats.ts?raw";
import resultSource from "./result.tsx?raw";
import scenariosSource from "./scenarios.ts?raw";
import { scenarios } from "./scenarios";
import * as statsModule from "./getUserStats";

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="stats-playground" />),
}));

describe("getUserStats page", () => {
  it("discovers its route, Training navigation and exercise statement", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/training/get-user-stats"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "getUserStats" })).toBeVisible();
    const training = screen.getByRole("button", { name: "Training" });
    expect(training).toHaveClass("active");
    await user.click(training);
    expect(screen.getByRole("link", { name: "getUserStats" })).toHaveAttribute("href", "/training/get-user-stats");
    expect(screen.getByRole("link", { name: "getUserStats" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByText("Условие задачи: статистика заказов"));
    expect(screen.getByRole("heading", { name: "Валидация входных данных" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Дополнительные вопросы" })).toBeVisible();
  });

  it("runs all scenarios repeatedly and uses the displayed sources in Sandpack", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/training/get-user-stats"]}><App /></MemoryRouter>);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Проверка ещё не запускалась.");
    for (let run = 0; run < 2; run++) {
      await user.click(screen.getByRole("button", { name: "Запустить проверку" }));
      expect(within(status).getAllByText("Пройдено")).toHaveLength(scenarios.length);
      expect(within(status).queryByText("Не пройдено")).not.toBeInTheDocument();
    }
    expect(getUserStatsExample.files).toEqual([
      { path: "getUserStats.ts", language: "ts", source: getUserStatsSource },
      { path: "scenarios.ts", language: "ts", source: scenariosSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
    ]);
    expect(screen.getByRole("tabpanel").querySelector("code")?.textContent).toBe(getUserStatsSource);
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("stats-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": resultSource, "/getUserStats.ts": getUserStatsSource, "/scenarios.ts": scenariosSource },
      template: "react-ts",
    }), undefined);
  });
  it("accepts equivalent statistics with a different object property order", async () => {
    const original = statsModule.default;
    const spy = vi.spyOn(statsModule, "default").mockImplementation(orders =>
      original(orders).map(({ userId, count, total }) => ({ count, total, userId })),
    );
    try {
      const user = userEvent.setup();
      render(<MemoryRouter initialEntries={["/training/get-user-stats"]}><App /></MemoryRouter>);
      await user.click(screen.getByRole("button", { name: "Запустить проверку" }));
      expect(within(screen.getByRole("status")).getAllByText("Пройдено")).toHaveLength(scenarios.length);
    } finally {
      spy.mockRestore();
    }
  });

});
