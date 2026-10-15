import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RenderCountResult from "./example-1/result/result";
import PreviousValueResult from "./example-2/result/result";
import FocusResult from "./example-3/result/result";

describe("useRef examples", () => {
  it("labels the render count input", () => {
    render(<RenderCountResult />);

    expect(
      screen.getByRole("textbox", { name: "Name for render count" }),
    ).toHaveAttribute("id", "render-count-name");
  });

  it("shows the previously committed input value", async () => {
    const user = userEvent.setup();
    render(<PreviousValueResult />);

    const input = screen.getByRole("textbox", {
      name: "Name for previous value",
    });
    await user.type(input, "AB");

    expect(screen.getByText(/My name is/)).toHaveTextContent(
      "My name is AB and it used to be A",
    );
  });

  it("moves focus to the input from the focus control", async () => {
    const user = userEvent.setup();
    render(<FocusResult />);

    const input = screen.getByRole("textbox", { name: "Name to focus" });
    await user.click(screen.getByRole("button", { name: "Focus on input" }));

    expect(input).toHaveFocus();
  });
});
