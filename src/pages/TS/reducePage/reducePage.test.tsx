import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../../../app";
import { reduceExample } from "./example";
import previewSource from "./preview.css?raw";
import reduceSource from "./reduce.ts?raw";
import ReducePage from "./reducePage";
import Result from "./result";
import resultSource from "./result.tsx?raw";

vi.mock("./result", () => ({
  default: () => <div data-testid="reduce-entry" />,
}));

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="reduce-playground" />),
}));

describe("reduce page", () => {
  it("discovers the direct route and active TS group", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/ts/reduce"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "reduce" })).toBeVisible();
    expect(screen.getByTestId("reduce-entry")).toBeVisible();
    const typescriptGroup = screen.getByRole("button", { name: "TS" });
    expect(typescriptGroup).toHaveClass("active");
    await user.click(typescriptGroup);
    const link = screen.getByRole("link", { name: "reduce" });
    expect(link).toHaveAttribute("href", "/ts/reduce");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
  });

  it("shows the exact raw files and maps them into the optional Sandpack", async () => {
    const user = userEvent.setup();
    render(<ReducePage />);

    expect(reduceExample.entry).toBe(Result);
    expect(reduceExample.files).toEqual([
      { path: "reduce.ts", language: "ts", source: reduceSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
      { path: "preview.css", language: "css", source: previewSource },
    ]);
    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code).toHaveAttribute("data-source-path", "reduce.ts");
    expect(code.textContent).toBe(reduceSource);
    await user.click(screen.getByRole("tab", { name: "result.tsx" }));
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code.textContent).toBe(resultSource);

    expect(screen.queryByTestId("reduce-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("reduce-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: {
        "/App.tsx": resultSource,
        "/preview.css": previewSource,
        "/reduce.ts": reduceSource,
      },
      template: "react-ts",
    }), undefined);
  });
});
