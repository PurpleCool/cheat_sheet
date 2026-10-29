import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../../../app";
import { storeExample } from "./example";
import Result from "./result";
import resultSource from "./result.tsx?raw";
import storeSource from "./store.ts?raw";
import StorePage from "./storePage";

vi.mock("./result", () => ({
  default: () => <div data-testid="store-entry" />,
}));

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="store-playground" />),
}));

describe("Store page", () => {
  it("discovers the direct route and active Useful group", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/useful/store"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Store" })).toBeVisible();
    expect(screen.getByTestId("store-entry")).toBeVisible();
    const usefulGroup = screen.getByRole("button", { name: "Useful" });
    expect(usefulGroup).toHaveClass("active");
    await user.click(usefulGroup);
    const link = screen.getByRole("link", { name: "Store" });
    expect(link).toHaveAttribute("href", "/useful/store");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
  });

  it("shows exact sources and maps them into the optional Sandpack", async () => {
    const user = userEvent.setup();
    render(<StorePage />);

    expect(storeExample.entry).toBe(Result);
    expect(storeExample.files).toEqual([
      { path: "store.ts", language: "ts", source: storeSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
    ]);

    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code).toHaveAttribute("data-source-path", "store.ts");
    expect(code.textContent).toBe(storeSource);
    await user.click(screen.getByRole("tab", { name: "result.tsx" }));
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code.textContent).toBe(resultSource);

    expect(screen.queryByTestId("store-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("store-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": resultSource, "/store.ts": storeSource },
      template: "react-ts",
    }), undefined);
  });
});
