import { Sandpack } from "@codesandbox/sandpack-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../../../app";
import compressSource from "./compress.ts?raw";
import CompressPage from "./compressPage";
import { compressExample } from "./example";
import Result from "./result";
import resultSource from "./result.tsx?raw";

vi.mock("./result", () => ({
  default: () => <div data-testid="compress-entry" />,
}));

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="compress-playground" />),
}));

describe("compress page", () => {
  it("discovers the direct route and active Useful group", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/useful/compress"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "compress" })).toBeVisible();
    expect(screen.getByTestId("compress-entry")).toBeVisible();
    const usefulGroup = screen.getByRole("button", { name: "Useful" });
    expect(usefulGroup).toHaveClass("active");
    await user.click(usefulGroup);
    const link = screen.getByRole("link", { name: "compress" });
    expect(link).toHaveAttribute("href", "/useful/compress");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
  });

  it("shows exact sources and maps them into the optional Sandpack", async () => {
    const user = userEvent.setup();
    render(<CompressPage />);

    expect(compressExample.entry).toBe(Result);
    expect(compressExample.files).toEqual([
      { path: "compress.ts", language: "ts", source: compressSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
    ]);

    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code).toHaveAttribute("data-source-path", "compress.ts");
    expect(code.textContent).toBe(compressSource);
    await user.click(screen.getByRole("tab", { name: "result.tsx" }));
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code.textContent).toBe(resultSource);

    expect(screen.queryByTestId("compress-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("compress-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": resultSource, "/compress.ts": compressSource },
      template: "react-ts",
    }), undefined);
  });
});
