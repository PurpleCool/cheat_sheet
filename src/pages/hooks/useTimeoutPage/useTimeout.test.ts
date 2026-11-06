import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimeout } from "./useTimeout";

describe("useTimeout", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls the callback once after the delay", () => {
    const callback = vi.fn();
    renderHook(() => useTimeout(callback, 1000));

    act(() => vi.advanceTimersByTime(999));
    expect(callback).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1000));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("uses the latest callback without resetting the deadline", () => {
    const original = vi.fn();
    const latest = vi.fn();
    const { rerender } = renderHook(
      ({ callback }) => useTimeout(callback, 1000),
      { initialProps: { callback: original } },
    );

    act(() => vi.advanceTimersByTime(600));
    rerender({ callback: latest });
    act(() => vi.advanceTimersByTime(399));
    expect(latest).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(original).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it("cancels the old timer and waits the new delay in full", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useTimeout(callback, delay),
      { initialProps: { delay: 1000 } },
    );

    act(() => vi.advanceTimersByTime(600));
    rerender({ delay: 2000 });
    act(() => vi.advanceTimersByTime(1999));
    expect(callback).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels the pending callback on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));
    unmount();

    act(() => vi.advanceTimersByTime(1000));
    expect(callback).not.toHaveBeenCalled();
  });
});
