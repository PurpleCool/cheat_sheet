import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useContextExample } from "../../pages/hooks/useContextPage/example";
import { useRefExamples } from "../../pages/hooks/useRefPage/examples";
import ExampleView from "./exampleView";
import type { ExampleDefinition } from "./types";

vi.mock("./sandpackPlayground", () => ({
  default: () => <div data-testid="sandpack-playground" />,
}));

function expectActiveTab(tab: HTMLElement, example: ExampleDefinition) {
  const panel = screen.getByRole("tabpanel");
  const file = example.files.find(({ path }) => path === tab.textContent);
  if (!file) {
    throw new Error(`Expected a source file for tab ${tab.textContent}`);
  }

  expect(tab).toHaveFocus();
  for (const otherTab of screen.getAllByRole("tab")) {
    expect(otherTab).toHaveAttribute("aria-controls", panel.id);
    expect(otherTab).toHaveAttribute("aria-selected", String(otherTab === tab));
    expect(otherTab).toHaveAttribute("tabindex", otherTab === tab ? "0" : "-1");
  }
  expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  expect(panel).toHaveAttribute("tabindex", "0");
  expect(panel.querySelector("code")).toHaveAttribute(
    "data-source-path",
    file.path,
  );
  expect(panel.querySelector("code")?.textContent).toBe(file.source);
}

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

  describe.each([
    {
      name: "useContext source tree",
      example: useContextExample,
      paths: [
        "result.tsx",
        "result.css",
        "contextParent.tsx",
        "functionContextComponent.tsx",
        "classContextComponent.tsx",
        "themeContext.ts",
      ],
    },
    {
      name: "flat useRef tabs",
      example: {
        ...useRefExamples[0],
        files: useRefExamples.map(({ id, files }) => ({
          ...files[0],
          path: `${id}/result.tsx`,
        })),
      },
      paths: [
        "render-count/result.tsx",
        "previous-value/result.tsx",
        "input-focus/result.tsx",
      ],
    },
  ])("keyboard navigation for $name", ({ example, paths }) => {
    it.each(["Home", "End"])("selects the DOM boundary with %s", async (key) => {
      const user = userEvent.setup();
      render(<ExampleView example={example} />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs.map((tab) => tab.textContent)).toEqual(paths);
      await user.tab();
      expectActiveTab(screen.getByRole("tab", { selected: true }), example);

      await user.click(tabs[1]);
      expectActiveTab(tabs[1], example);
      await user.keyboard(`{${key}}`);

      expectActiveTab(key === "Home" ? tabs[0] : tabs[tabs.length - 1], example);
    });

    it.each([
      { key: "ArrowRight", step: 1 },
      { key: "ArrowLeft", step: -1 },
    ])("traverses every DOM tab and wraps with $key", async ({ key, step }) => {
      const user = userEvent.setup();
      render(<ExampleView example={example} />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs.map((tab) => tab.textContent)).toEqual(paths);
      const initialTab = screen.getByRole("tab", { name: example.files[0].path });
      await user.tab();
      expectActiveTab(initialTab, example);
      let index = tabs.indexOf(initialTab);

      for (let count = 0; count < tabs.length; count += 1) {
        index = (index + step + tabs.length) % tabs.length;
        await user.keyboard(`{${key}}`);
        expectActiveTab(tabs[index], example);
      }
    });
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
