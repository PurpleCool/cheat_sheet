import { StrictMode } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Result from "./result";

describe("Debounce demo", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("starts idle and logs the latest invocation after 2000 ms of quiet", () => {
    render(<Result />);
    const log = screen.getByRole("log", { name: "Вывод" });
    const message = screen.getByRole("textbox", { name: "Сообщение" });
    const invoke = screen.getByRole("button", { name: "Вызвать" });

    expect(log).toHaveTextContent("Вызовов пока нет.");
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(invoke);
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.change(message, { target: { value: " world" } });
    fireEvent.click(invoke);
    act(() => vi.advanceTimersByTime(1999));
    expect(within(log).queryAllByRole("listitem")).toHaveLength(0);

    // Editing alone does not change the last arguments sent to the wrapper.
    fireEvent.change(message, { target: { value: "not invoked" } });
    act(() => vi.advanceTimersByTime(1));
    expect(within(log).getAllByRole("listitem").map((item) => item.textContent))
      .toEqual([" world"]);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(2000));
    expect(within(log).getAllByRole("listitem")).toHaveLength(1);
  });

  it("flushes hello immediately, cancels world, and can start again", () => {
    render(<Result />);
    const log = screen.getByRole("log", { name: "Вывод" });
    const invoke = screen.getByRole("button", { name: "Вызвать" });
    const flush = screen.getByRole("button", { name: "flush()" });
    const cancel = screen.getByRole("button", { name: "cancel()" });
    const message = screen.getByRole("textbox", { name: "Сообщение" });

    fireEvent.click(invoke);
    fireEvent.click(flush);
    expect(within(log).getByRole("listitem")).toHaveTextContent("hello");
    fireEvent.change(message, { target: { value: " world" } });
    fireEvent.click(invoke);
    fireEvent.click(cancel);
    fireEvent.click(flush);
    act(() => vi.advanceTimersByTime(2000));
    expect(within(log).getAllByRole("listitem")).toHaveLength(1);

    fireEvent.click(cancel);
    fireEvent.click(invoke);
    fireEvent.click(flush);
    fireEvent.click(flush);
    act(() => vi.advanceTimersByTime(2000));
    expect(within(log).getAllByRole("listitem").map((item) => item.textContent))
      .toEqual(["hello", " world"]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels pending work on unmount, including under StrictMode", () => {
    const { unmount } = render(<StrictMode><Result /></StrictMode>);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Вызвать" }));
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(2000));
  });
});
