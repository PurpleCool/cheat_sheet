import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../../../app";
import asyncAwaitSource from "./asyncAwait.ts?raw";
import AsyncAwaitPage from "./asyncAwaitPage";
import { asyncAwaitExample } from "./example";
import previewSource from "./preview.css?raw";
import Result from "./result";
import resultSource from "./result.tsx?raw";

vi.mock("./result", () => ({
  default: () => <div data-testid="async-await-entry" />,
}));

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="async-await-playground" />),
}));

describe("async/await page", () => {
  it("discovers the direct route and active Useful group", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/useful/async-await"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "async/await" })).toBeVisible();
    expect(screen.getByTestId("async-await-entry")).toBeVisible();
    const usefulGroup = screen.getByRole("button", { name: "Useful" });
    expect(usefulGroup).toHaveClass("active");
    await user.click(usefulGroup);
    const link = screen.getByRole("link", { name: "async/await" });
    expect(link).toHaveAttribute("href", "/useful/async-await");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
  });

  it("shows exact sources and maps them into the optional Sandpack", async () => {
    const user = userEvent.setup();
    render(<AsyncAwaitPage />);

    expect(asyncAwaitExample.entry).toBe(Result);
    expect(asyncAwaitExample.files).toEqual([
      { path: "asyncAwait.ts", language: "ts", source: asyncAwaitSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
      { path: "preview.css", language: "css", source: previewSource },
    ]);

    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code).toHaveAttribute("data-source-path", "asyncAwait.ts");
    expect(code.textContent).toBe(asyncAwaitSource);
    await user.click(screen.getByRole("tab", { name: "result.tsx" }));
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code.textContent).toBe(resultSource);

    expect(screen.queryByTestId("async-await-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("async-await-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: {
        "/App.tsx": resultSource,
        "/asyncAwait.ts": asyncAwaitSource,
        "/preview.css": previewSource,
      },
      template: "react-ts",
    }), undefined);
  });
});
