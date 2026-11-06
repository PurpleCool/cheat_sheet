import { StrictMode } from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Result from "./result";
import { useThrottleWithLeading } from "./useThrottleWithLeading";

describe("useThrottleWithLeading", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns the initial value and passes the first change immediately", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottleWithLeading(value, 1000),
      { initialProps: { value: "initial" } },
    );
    expect(result.current).toBe("initial");
    rerender({ value: "first" });
    expect(result.current).toBe("first");
  });

  it("keeps the leading value until the deadline then publishes only the latest", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottleWithLeading(value, 1000),
      { initialProps: { value: "initial" } },
    );
    rerender({ value: "first" });
    act(() => vi.advanceTimersByTime(400));
    rerender({ value: "second" });
    act(() => vi.advanceTimersByTime(400));
    rerender({ value: "latest" });
    act(() => vi.advanceTimersByTime(199));
    expect(result.current).toBe("first");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("latest");

    act(() => vi.advanceTimersByTime(1));
    rerender({ value: "next leading" });
    expect(result.current).toBe("next leading");
    rerender({ value: "next trailing" });
    act(() => vi.advanceTimersByTime(999));
    expect(result.current).toBe("next leading");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("next trailing");
  });

  it("applies a changed delay only to the next timer", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottleWithLeading(value, delay),
      { initialProps: { value: "initial", delay: 1000 } },
    );
    rerender({ value: "first", delay: 1000 });
    act(() => vi.advanceTimersByTime(400));
    rerender({ value: "latest", delay: 2000 });
    act(() => vi.advanceTimersByTime(599));
    expect(result.current).toBe("first");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("latest");

    rerender({ value: "next leading", delay: 2000 });
    rerender({ value: "next trailing", delay: 2000 });
    act(() => vi.advanceTimersByTime(1999));
    expect(result.current).toBe("next leading");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("next trailing");
  });

  it("does not start a waiting window for unchanged values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottleWithLeading(value, delay),
      { initialProps: { value: "initial", delay: 1000 } },
    );
    rerender({ value: "initial", delay: 2000 });
    rerender({ value: "changed", delay: 2000 });
    expect(result.current).toBe("changed");
  });

  it("clears the active timer on unmount", () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useThrottleWithLeading(value, 1000),
      { initialProps: { value: "initial" } },
    );
    rerender({ value: "first" });
    rerender({ value: "pending" });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("demonstrates leading and trailing updates under StrictMode", () => {
    render(<StrictMode><Result /></StrictMode>);
    const input = screen.getByRole("textbox", { name: "Текущее значение" });
    const status = screen.getByRole("status", { name: "Результат throttle" });
    expect(status).toHaveTextContent('Результат: ""');

    fireEvent.change(input, { target: { value: "A" } });
    expect(status).toHaveTextContent('Результат: "A"');
    act(() => vi.advanceTimersByTime(500));
    fireEvent.change(input, { target: { value: "AB" } });
    fireEvent.change(input, { target: { value: "ABC" } });
    expect(status).toHaveTextContent('Результат: "A"');
    act(() => vi.advanceTimersByTime(1500));
    expect(status).toHaveTextContent('Результат: "ABC"');
    fireEvent.change(input, { target: { value: "ABCD" } });
    expect(status).toHaveTextContent('Результат: "ABCD"');
  });
});
