import { StrictMode } from "react";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Result from "./result";
import { usePrevious } from "./usePrevious";

describe("usePrevious", () => {
  it("starts undefined and remembers each preceding render's value", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });
    expect(result.current).toBeUndefined();

    rerender({ value: 1 });
    expect(result.current).toBe(0);
    rerender({ value: 2 });
    expect(result.current).toBe(1);
    rerender({ value: 2 });
    expect(result.current).toBe(2);
  });

  it("preserves object identity and supports undefined values", () => {
    const initial = { name: "first" };
    const { result, rerender } = renderHook(
      ({ value }: { value: typeof initial | undefined }) => usePrevious(value),
      { initialProps: { value: initial as typeof initial | undefined } },
    );
    expect(result.current).toBeUndefined();
    rerender({ value: undefined });
    expect(result.current).toBe(initial);
    rerender({ value: { name: "next" } });
    expect(result.current).toBeUndefined();
  });

  it("demonstrates changes, unchanged values and remounts under StrictMode", async () => {
    const user = userEvent.setup();
    render(<StrictMode><Result /></StrictMode>);
    const status = screen.getByRole("status", { name: "Предыдущее значение" });
    expect(status).toHaveTextContent("Предыдущее значение: undefined");

    fireEvent.change(screen.getByRole("textbox", { name: "Текущее значение" }), {
      target: { value: "Next" },
    });
    expect(status).toHaveTextContent('Предыдущее значение: "Hello!"');
    await user.click(screen.getByRole("button", { name: "Рендер без изменения значения" }));
    expect(status).toHaveTextContent('Предыдущее значение: "Next"');

    await user.click(screen.getByRole("button", { name: "Пересоздать компонент" }));
    expect(screen.getByRole("status", { name: "Предыдущее значение" }))
      .toHaveTextContent("Предыдущее значение: undefined");
  });
});
