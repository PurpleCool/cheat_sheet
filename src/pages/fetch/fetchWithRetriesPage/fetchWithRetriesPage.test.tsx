import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sandpack } from "@codesandbox/sandpack-react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../../../app";
import { fetchWithRetriesExample } from "./example";
import fetchWithRetriesSource from "./fetchWithRetries.ts?raw";
import FetchWithRetriesPage from "./fetchWithRetriesPage";
import Result from "./result";
import resultSource from "./result.tsx?raw";

vi.mock("./result", () => ({
  default: () => <div data-testid="fetch-with-retries-entry" />,
}));

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="fetch-with-retries-playground" />),
}));

describe("fetchWithRetries page", () => {
  it("discovers the direct route and active Fetch group", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/fetch/fetch-with-retries"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "fetchWithRetries" })).toBeVisible();
    expect(screen.getByTestId("fetch-with-retries-entry")).toBeVisible();
    const fetchGroup = screen.getByRole("button", { name: "Fetch" });
    expect(fetchGroup).toHaveClass("active");
    await user.click(fetchGroup);
    const link = screen.getByRole("link", { name: "fetchWithRetries" });
    expect(link).toHaveAttribute("href", "/fetch/fetch-with-retries");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("active");
  });

  it("shows the exact raw files and maps them into the optional Sandpack", async () => {
    const user = userEvent.setup();
    render(<FetchWithRetriesPage />);

    expect(fetchWithRetriesExample.entry).toBe(Result);
    expect(fetchWithRetriesExample.files).toEqual([
      { path: "fetchWithRetries.ts", language: "ts", source: fetchWithRetriesSource },
      { path: "result.tsx", language: "tsx", source: resultSource },
    ]);
    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code).toHaveAttribute("data-source-path", "fetchWithRetries.ts");
    expect(code.textContent).toBe(fetchWithRetriesSource);
    await user.click(screen.getByRole("tab", { name: "result.tsx" }));
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code.textContent).toBe(resultSource);

    expect(screen.queryByTestId("fetch-with-retries-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("fetch-with-retries-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": resultSource, "/fetchWithRetries.ts": fetchWithRetriesSource },
      template: "react-ts",
    }), undefined);
  });
});
