import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Result from "./result";

describe("useTimeout demo", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("prints the edited message at the original deadline", () => {
    render(<Result />);
    const output = screen.getByRole("log", { name: "Вывод таймера" });
    expect(output).toHaveTextContent("Вызовов пока нет.");

    act(() => vi.advanceTimersByTime(3000));
    fireEvent.change(screen.getByRole("textbox", { name: "Сообщение" }), {
      target: { value: "Updated" },
    });
    act(() => vi.advanceTimersByTime(2000));
    expect(output).toHaveTextContent("Updated");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("restarts waiting when a different delay is selected", () => {
    render(<Result />);
    const output = screen.getByRole("log", { name: "Вывод таймера" });

    act(() => vi.advanceTimersByTime(4000));
    fireEvent.change(screen.getByRole("combobox", { name: "Задержка" }), {
      target: { value: "2000" },
    });
    act(() => vi.advanceTimersByTime(1999));
    expect(output).toHaveTextContent("Вызовов пока нет.");
    act(() => vi.advanceTimersByTime(1));
    expect(output).toHaveTextContent("Hello!");
  });
});
