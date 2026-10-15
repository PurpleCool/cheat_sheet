import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useContextExample } from "../../pages/useContextPage/example";
import ExampleView from "./exampleView";

describe("ExampleView", () => {
  it("renders and switches between raw source files", async () => {
    const user = userEvent.setup();
    render(<ExampleView example={useContextExample} />);

    const code = screen.getByRole("code");
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
});
