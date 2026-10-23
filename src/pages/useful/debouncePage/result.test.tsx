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

  it("starts idle and logs the latest input after 2000 ms of quiet", () => {
    render(<Result />);
    const log = screen.getByRole("log", { name: "Вывод" });
    const message = screen.getByRole("textbox", { name: "Сообщение" });

    expect(log).toHaveTextContent("Вызовов пока нет.");
    expect(message).toHaveValue("hello");
    expect(screen.queryByRole("button", { name: "Вызвать" })).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.input(message, { target: { value: "h" } });
    expect(within(log).queryAllByRole("listitem")).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.input(message, { target: { value: "hello world" } });
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(1999));
    expect(within(log).queryAllByRole("listitem")).toHaveLength(0);

    act(() => vi.advanceTimersByTime(1));
    expect(within(log).getAllByRole("listitem").map((item) => item.textContent))
      .toEqual(["hello world"]);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(2000));
    expect(within(log).getAllByRole("listitem")).toHaveLength(1);
  });

  it("flushes input immediately, cancels pending input, and can start again", () => {
    render(<Result />);
    const log = screen.getByRole("log", { name: "Вывод" });
    const flush = screen.getByRole("button", { name: "flush()" });
    const cancel = screen.getByRole("button", { name: "cancel()" });
    const message = screen.getByRole("textbox", { name: "Сообщение" });

    fireEvent.input(message, { target: { value: "hello!" } });
    fireEvent.click(flush);
    expect(within(log).getByRole("listitem")).toHaveTextContent("hello!");
    fireEvent.input(message, { target: { value: " world" } });
    fireEvent.click(cancel);
    fireEvent.click(flush);
    act(() => vi.advanceTimersByTime(2000));
    expect(within(log).getAllByRole("listitem")).toHaveLength(1);

    fireEvent.click(cancel);
    fireEvent.input(message, { target: { value: "again" } });
    fireEvent.click(flush);
    fireEvent.click(flush);
    act(() => vi.advanceTimersByTime(2000));
    expect(within(log).getAllByRole("listitem").map((item) => item.textContent))
      .toEqual(["hello!", "again"]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("debounces pasted text and deletion to an empty string", () => {
    render(<Result />);
    const log = screen.getByRole("log", { name: "Вывод" });
    const message = screen.getByRole("textbox", { name: "Сообщение" });

    fireEvent.input(message, {
      target: { value: "pasted text" },
      inputType: "insertFromPaste",
    });
    act(() => vi.advanceTimersByTime(1999));
    expect(within(log).queryAllByRole("listitem")).toHaveLength(0);
    fireEvent.input(message, {
      target: { value: "" },
      inputType: "deleteContentBackward",
    });
    act(() => vi.advanceTimersByTime(1999));
    expect(within(log).queryAllByRole("listitem")).toHaveLength(0);
    act(() => vi.advanceTimersByTime(1));
    expect(within(log).getAllByRole("listitem").map((item) => item.textContent))
      .toEqual([""]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels pending work on unmount, including under StrictMode", () => {
    const { unmount } = render(<StrictMode><Result /></StrictMode>);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.input(screen.getByRole("textbox", { name: "Сообщение" }), {
      target: { value: "pending" },
    });
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(2000));
  });
});
