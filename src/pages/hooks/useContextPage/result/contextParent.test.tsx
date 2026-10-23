import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ContextParent from "./contextParent";

describe("ContextParent", () => {
  it("toggles the theme for both consumers", async () => {
    const user = userEvent.setup();
    render(<ContextParent />);

    const functional = screen.getByText("Functional Component Example");
    const classBased = screen.getByText("Class Component Example");

    expect(functional).toHaveStyle({ backgroundColor: "#333" });
    expect(classBased).toHaveStyle({ backgroundColor: "#333" });

    await user.click(screen.getByRole("button", { name: "Toggle Theme" }));

    expect(functional).toHaveStyle({ backgroundColor: "#ccc" });
    expect(classBased).toHaveStyle({ backgroundColor: "#ccc" });
  });
});
