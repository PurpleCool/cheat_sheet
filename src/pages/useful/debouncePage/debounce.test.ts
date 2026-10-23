import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import debounce from "./debounce";

describe("debounce (preserved author implementation)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("resets the delay and forwards only the latest arguments and this", () => {
    const callback = vi.fn(function (this: { name: string }, value: string, count: number) {
      return `${this.name}: ${value} ${count}`;
    });
    const debounced = debounce(callback, 2000);
    const first = { name: "first" };
    const latest = { name: "latest" };

    expect(debounced.call(first, "hello", 1)).toBeUndefined();
    vi.advanceTimersByTime(1500);
    expect(callback).not.toHaveBeenCalled();
    debounced.call(latest, "world", 2);
    vi.advanceTimersByTime(1999);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledExactlyOnceWith("world", 2);
    expect(callback.mock.contexts).toEqual([latest]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("supports no arguments and another burst after a completed call", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledExactlyOnceWith();
    debounced();
    vi.advanceTimersByTime(99);
    expect(callback).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("cancel discards a pending call and permits a new burst", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("discard");
    vi.advanceTimersByTime(50);
    debounced.cancel();
    expect(vi.getTimerCount()).toBe(0);
    debounced.flush();
    vi.advanceTimersByTime(100);
    expect(callback).not.toHaveBeenCalled();

    debounced("keep");
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledExactlyOnceWith("keep");
  });

  it("flush immediately calls the latest receiver once and permits a new burst", () => {
    const callback = vi.fn(function (this: { name: string }, value: string) {
      return `${this.name}: ${value}`;
    });
    const debounced = debounce(callback, 100);
    const latest = { name: "latest" };

    debounced.call({ name: "first" }, "discard");
    vi.advanceTimersByTime(50);
    debounced.call(latest, "hello");
    debounced.flush();

    expect(callback).toHaveBeenCalledExactlyOnceWith("hello");
    expect(callback.mock.contexts).toEqual([latest]);
    expect(vi.getTimerCount()).toBe(0);
    debounced.flush();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    debounced.call(latest, "world");
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenLastCalledWith("world");
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it.each(["cancel", "flush"] as const)("%s is a no-op when idle", (method) => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced[method]();
    expect(vi.getTimerCount()).toBe(0);
    expect(callback).not.toHaveBeenCalled();
    debounced("done");
    vi.advanceTimersByTime(100);
    debounced[method]();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledExactlyOnceWith("done");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("zero wait still defers execution and keeps the latest call", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 0);

    debounced("first");
    debounced("latest");
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledExactlyOnceWith("latest");
  });

  it.each(["timer", "flush"] as const)(
    "documents the accepted limitation: reentry during %s drops the second invocation",
    (trigger) => {
      const callback = vi.fn((message: string) => {
        if (message === "first") {
          debounced("second");
        }
      });
      const debounced = debounce(callback, 100);

      debounced("first");
      if (trigger === "flush") {
        debounced.flush();
      } else {
        vi.advanceTimersByTime(100);
      }
      expect(callback).toHaveBeenCalledExactlyOnceWith("first");
      expect(vi.getTimerCount()).toBe(1);

      // Cleanup after func erased the reentrant call's arguments.
      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledExactlyOnceWith("first");
      expect(vi.getTimerCount()).toBe(0);
    },
  );
});
