import { render, screen } from "@testing-library/react";
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

    const code = screen.getByRole("code");
    expect(code).toHaveAttribute("data-source-path", "result.tsx");
    expect(code).toHaveTextContent("ContextParent");

    await user.click(screen.getByRole("tab", { name: "contextParent.tsx" }));

    expect(code).toHaveAttribute("data-source-path", "contextParent.tsx");
    expect(code.textContent).toBe(
      useContextExample.files.find(
        ({ path }) => path === "contextParent.tsx",
      )?.source,
    );
  });

  it("links tabs to the panel and supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<ExampleView example={useContextExample} />);

    const tabs = screen.getAllByRole("tab");
    const panel = screen.getByRole("tabpanel");

    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tabs[0].id);
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");

    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(panel).toHaveAttribute("aria-labelledby", tabs[1].id);

    await user.keyboard("{End}");
    expect(tabs.at(-1)).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(tabs[0]).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(tabs.at(-1)).toHaveFocus();

    await user.keyboard("{Home}");
    expect(tabs[0]).toHaveFocus();
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
