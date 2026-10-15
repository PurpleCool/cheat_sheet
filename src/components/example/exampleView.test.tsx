import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useContextExample } from "../../pages/useContextPage/example";
import ExampleView from "./exampleView";

vi.mock("./sandpackPlayground", () => ({
  default: () => <div data-testid="sandpack-playground" />,
}));

describe("ExampleView", () => {
  it("renders and switches between raw source files", async () => {
    const user = userEvent.setup();
    render(<ExampleView example={useContextExample} />);

    const code = screen.getByRole("tabpanel").querySelector("code");
    if (!code) {
      throw new Error("Expected the active source panel to contain code");
    }
    expect(code).toHaveAttribute("data-source-path", "themeContext.ts");
    expect(code).toHaveTextContent("createContext");

    await user.click(screen.getByRole("tab", { name: "contextParent.tsx" }));

    expect(code).toHaveAttribute("data-source-path", "contextParent.tsx");
    expect(code.textContent).toBe(
      useContextExample.files.find(
        ({ path }) => path === "contextParent.tsx",
      )?.source,
    );
  });

  it("shows the suggested useContext file hierarchy", () => {
    render(<ExampleView example={useContextExample} />);

    expect(screen.getByText("Suggested project structure")).toBeInTheDocument();
    const root = screen
      .getByText("root")
      .closest<HTMLElement>(".source-structure-item");
    const utils = screen
      .getByText("utils")
      .closest<HTMLElement>(".source-structure-item");

    if (!root || !utils) {
      throw new Error("Expected root and utils structure groups");
    }

    expect(within(root).getByRole("tab", { name: "result.tsx" })).toBeVisible();
    expect(within(root).getByRole("tab", { name: "result.css" })).toBeVisible();
    expect(
      within(root).getByRole("tab", { name: "contextParent.tsx" }),
    ).toBeVisible();
    expect(
      within(root).getByRole("tab", { name: "functionContextComponent.tsx" }),
    ).toBeVisible();
    expect(
      within(root).getByRole("tab", { name: "classContextComponent.tsx" }),
    ).toBeVisible();
    expect(
      within(utils).getByRole("tab", { name: "themeContext.ts" }),
    ).toBeVisible();
    expect(screen.getAllByRole("tab")).toHaveLength(6);
  });

  it("links tabs to the panel and supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<ExampleView example={useContextExample} />);

    const panel = screen.getByRole("tabpanel");
    const themeTab = screen.getByRole("tab", { name: "themeContext.ts" });
    const parentTab = screen.getByRole("tab", { name: "contextParent.tsx" });
    const lastTab = screen.getByRole("tab", { name: "result.css" });

    expect(themeTab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", themeTab.id);
    expect(themeTab).toHaveAttribute("tabindex", "0");
    expect(parentTab).toHaveAttribute("tabindex", "-1");

    themeTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(parentTab).toHaveFocus();
    expect(parentTab).toHaveAttribute("aria-selected", "true");
    expect(panel).toHaveAttribute("aria-labelledby", parentTab.id);

    await user.keyboard("{End}");
    expect(lastTab).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(themeTab).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(lastTab).toHaveFocus();

    await user.keyboard("{Home}");
    expect(themeTab).toHaveFocus();
  });

  it("loads the editable playground only when requested", async () => {
    const user = userEvent.setup();
    render(<ExampleView example={useContextExample} />);

    expect(screen.queryByTestId("sandpack-playground")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Edit in playground" }),
    );

    expect(await screen.findByTestId("sandpack-playground")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close playground" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
