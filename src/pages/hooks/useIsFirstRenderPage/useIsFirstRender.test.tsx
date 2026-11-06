import { StrictMode } from "react";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Result from "./result";
import { useIsFirstRender } from "./useIsFirstRender";

describe("useIsFirstRender", () => {
  it("returns true initially and false on every later render", () => {
    const { result, rerender } = renderHook(() => useIsFirstRender());
    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(false);
    rerender();
    expect(result.current).toBe(false);
  });

  it("starts fresh for a new component instance", () => {
    const first = renderHook(() => useIsFirstRender());
    first.rerender();
    expect(first.result.current).toBe(false);
    first.unmount();

    const second = renderHook(() => useIsFirstRender());
    expect(second.result.current).toBe(true);
  });

  it("demonstrates rerenders and remounts under StrictMode", async () => {
    const user = userEvent.setup();
    render(<StrictMode><Result /></StrictMode>);

    const status = screen.getByRole("status", { name: "Первый рендер" });
    expect(status).toHaveTextContent("isFirstRender: true");

    await user.click(screen.getByRole("button", { name: "Вызвать повторный рендер" }));
    expect(status).toHaveTextContent("isFirstRender: false");
    expect(screen.getByText("Обновлений: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Пересоздать компонент" }));
    expect(screen.getByRole("status", { name: "Первый рендер" }))
      .toHaveTextContent("isFirstRender: true");
    expect(screen.getByText("Обновлений: 0")).toBeInTheDocument();
  });
});
