import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { dependencies } from "../../../../package.json";
import App from "../../../app";
import { quickStartExample } from "./example";
import storeSource from "./app/store.ts?raw";
import hooksSource from "./app/hooks.ts?raw";
import counterSliceSource from "./features/counter/counterSlice.ts?raw";
import counterSource from "./features/counter/Counter.tsx?raw";
import resultSource from "./result.tsx?raw";

vi.mock("./features/counter/Counter", () => ({
  Counter: () => <div data-testid="quick-start-counter" />,
}));

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="quick-start-playground" />),
}));

describe("Redux Quick Start page", () => {
  it("discovers the direct route, active Redux group and tutorial link", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/redux/quick-start"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Quick Start" })).toBeVisible();
    expect(screen.getByTestId("quick-start-counter")).toBeVisible();
    const redux = screen.getByRole("button", { name: "Redux" });
    expect(redux).toHaveClass("active");
    await user.click(redux);
    const link = screen.getByRole("link", { name: "Quick Start" });
    expect(link).toHaveAttribute("href", "/redux/quick-start");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Redux — Quick Start" }))
      .toHaveAttribute("href", "https://redux.js.org/tutorials/quick-start");
  });

  it("shows exact source files and supplies their paths and Redux dependencies to Sandpack", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/redux/quick-start"]}><App /></MemoryRouter>);
    const files = [
      { path: "app/store.ts", language: "ts", source: storeSource },
      { path: "app/hooks.ts", language: "ts", source: hooksSource },
      { path: "features/counter/counterSlice.ts", language: "ts", source: counterSliceSource },
      { path: "features/counter/Counter.tsx", language: "tsx", source: counterSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
    ];
    expect(quickStartExample.files).toEqual(files);
    for (const file of files) {
      await user.click(screen.getByRole("tab", { name: file.path }));
      const code = screen.getByRole("tabpanel").querySelector("code");
      expect(code).toHaveAttribute("data-source-path", file.path);
      expect(code?.textContent).toBe(file.source);
    }
    expect(screen.queryByTestId("quick-start-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("quick-start-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: {
        "/App.tsx": resultSource,
        "/app/store.ts": storeSource,
        "/app/hooks.ts": hooksSource,
        "/features/counter/counterSlice.ts": counterSliceSource,
        "/features/counter/Counter.tsx": counterSource,
      },
      customSetup: {
        dependencies: {
          react: "19.3.1",
          "react-dom": "19.3.1",
          "@reduxjs/toolkit": dependencies["@reduxjs/toolkit"],
          "react-redux": dependencies["react-redux"],
        },
      },
      template: "react-ts",
    }), undefined);
  });
});
