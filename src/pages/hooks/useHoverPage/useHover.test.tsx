import { StrictMode } from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Result from "./result";
import { useHover } from "./useHover";

afterEach(() => vi.restoreAllMocks());

describe("useHover", () => {
  it("keeps a stable callback ref across renders", () => {
    const { result, rerender } = renderHook(() => useHover<HTMLDivElement>());
    const ref = result.current[0];
    expect(result.current[1]).toBe(false);
    rerender();
    expect(result.current[0]).toBe(ref);
  });

  it("reads the element's initial hover state and resets when detached", () => {
    const element = document.createElement("div");
    const matches = vi.spyOn(element, "matches").mockReturnValue(true);
    const { result } = renderHook(() => useHover<HTMLDivElement>());

    act(() => { result.current[0](element); });
    expect(matches).toHaveBeenCalledWith(":hover");
    expect(result.current[1]).toBe(true);
    act(() => { result.current[0](null); });
    expect(result.current[1]).toBe(false);
    act(() => { element.dispatchEvent(new Event("pointerenter")); });
    expect(result.current[1]).toBe(false);
  });

  it("tracks pointer entry and exit under StrictMode", () => {
    render(<StrictMode><Result /></StrictMode>);
    const region = screen.getByRole("region", { name: "Область наведения" });
    const status = screen.getByRole("status", { name: "Состояние наведения" });
    expect(status).toHaveTextContent("isHovered: false");

    fireEvent.pointerEnter(region);
    expect(status).toHaveTextContent("isHovered: true");
    fireEvent.pointerLeave(region);
    expect(status).toHaveTextContent("isHovered: false");
  });

  it("unsubscribes the replaced element and tracks the new one", () => {
    render(<Result />);
    const previous = screen.getByRole("region", { name: "Область наведения" });
    const status = screen.getByRole("status", { name: "Состояние наведения" });
    fireEvent.pointerEnter(previous);
    expect(status).toHaveTextContent("isHovered: true");

    fireEvent.click(screen.getByRole("button", { name: "Заменить элемент" }));
    const current = screen.getByRole("region", { name: "Область наведения" });
    expect(current).not.toBe(previous);
    expect(status).toHaveTextContent("isHovered: false");
    fireEvent.pointerEnter(previous);
    expect(status).toHaveTextContent("isHovered: false");
    fireEvent.pointerEnter(current);
    expect(status).toHaveTextContent("isHovered: true");
    fireEvent.pointerLeave(previous);
    expect(status).toHaveTextContent("isHovered: true");
    fireEvent.pointerLeave(current);
    expect(status).toHaveTextContent("isHovered: false");
  });

  it("resets on hide and handles a newly shown element", () => {
    render(<Result />);
    const previous = screen.getByRole("region", { name: "Область наведения" });
    const status = screen.getByRole("status", { name: "Состояние наведения" });
    fireEvent.pointerEnter(previous);
    expect(status).toHaveTextContent("isHovered: true");
    fireEvent.click(screen.getByRole("button", { name: "Скрыть область" }));
    expect(screen.queryByRole("region", { name: "Область наведения" })).not.toBeInTheDocument();
    expect(status).toHaveTextContent("isHovered: false");
    fireEvent.pointerEnter(previous);
    expect(status).toHaveTextContent("isHovered: false");

    fireEvent.click(screen.getByRole("button", { name: "Показать область" }));
    fireEvent.pointerEnter(screen.getByRole("region", { name: "Область наведения" }));
    expect(status).toHaveTextContent("isHovered: true");
  });

  it("removes both pointer listeners on component unmount", () => {
    const { unmount } = render(<Result />);
    const region = screen.getByRole("region", { name: "Область наведения" });
    const removeListener = vi.spyOn(region, "removeEventListener");
    unmount();
    expect(removeListener).toHaveBeenCalledWith("pointerenter", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("pointerleave", expect.any(Function));
  });
});
