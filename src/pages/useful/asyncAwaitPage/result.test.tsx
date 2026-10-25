import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as asyncAwaitExercise from "./asyncAwait";
import Result from "./result";

const implementations = ["Promise-цепочка", "async/await"] as const;
const scenarios = [
  "Оба запроса успешны",
  "В первом ответе нет key",
  "Второй запрос завершается ошибкой",
] as const;

function output(implementation: string, scenario: string) {
  return screen.getByRole("status", {
    name: `Результат ${implementation}: ${scenario}`,
  });
}

describe("async/await demo", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("compares both implementations across success and error paths", async () => {
    render(<Result />);

    for (const implementation of implementations) {
      for (const scenario of scenarios) {
        fireEvent.click(screen.getByRole("button", {
          name: `Запустить ${implementation}: ${scenario}`,
        }));
      }
    }

    expect(screen.getAllByRole("button", { name: /Запустить/ }))
      .toSatisfy((buttons: HTMLButtonElement[]) =>
        buttons.length === 6 && buttons.every((button) => button.disabled)
      );

    await act(async () => vi.runAllTimersAsync());

    for (const implementation of implementations) {
      const success = output(implementation, scenarios[0]);
      expect(success).toHaveTextContent("getJson('one')");
      expect(success).toHaveTextContent("getJson('two')");
      expect(success).toHaveTextContent("Данные из второго ответа");
      expect(success).toHaveTextContent("Результат Promise:");
      expect(within(success).getByText('"Данные из второго ответа"', {
        selector: "p code",
      })).toBeVisible();

      const missingKey = output(implementation, scenarios[1]);
      expect(missingKey).toHaveTextContent("catch: Error: No key");
      expect(missingKey).not.toHaveTextContent("getJson('two')");
      expect(missingKey).toHaveTextContent("Результат Promise: undefined");

      const requestError = output(implementation, scenarios[2]);
      expect(requestError).toHaveTextContent("getJson('two')");
      expect(requestError).toHaveTextContent("Ошибка запроса: Сервис two недоступен");
      expect(requestError).toHaveTextContent("catch: Error: Сервис two недоступен");
      expect(requestError).toHaveTextContent("Результат Promise: undefined");
    }

    const requestErrorCard = screen
      .getByRole("heading", { name: "Второй запрос завершается ошибкой" })
      .closest("article")!;
    fireEvent.click(within(requestErrorCard).getByText("Показать моки ответов"));
    expect(requestErrorCard).toHaveTextContent("Error: Сервис two недоступен");
  });

  it("shows an unexpected rejection and enables the scenario again", async () => {
    vi.spyOn(asyncAwaitExercise, "asyncFunction")
      .mockRejectedValueOnce(new Error("catch не обработал ошибку"));
    render(<Result />);

    const button = screen.getByRole("button", {
      name: "Запустить async/await: Оба запроса успешны",
    });
    fireEvent.click(button);
    expect(button).toBeDisabled();

    await act(async () => Promise.resolve());

    const asyncOutput = output("async/await", scenarios[0]);
    expect(asyncOutput).toHaveTextContent(
      "Необработанная ошибка: Error: catch не обработал ошибку",
    );
    expect(asyncOutput).toHaveTextContent("Результат Promise: Promise отклонён");
    expect(button).toBeEnabled();
  });
});
