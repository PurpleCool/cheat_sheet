import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PreviousValueResult from "./example-2/result/result";
import FocusResult from "./example-3/result/result";

describe("useRef examples", () => {
  it("shows the previously committed input value", async () => {
    const user = userEvent.setup();
    render(<PreviousValueResult />);

    const input = screen.getByRole("textbox");
    await user.type(input, "AB");

    expect(screen.getByText(/My name is/)).toHaveTextContent(
      "My name is AB and it used to be A",
    );
  });

  it("moves focus to the input from the focus control", async () => {
    const user = userEvent.setup();
    render(<FocusResult />);

    const input = screen.getByRole("textbox");
    await user.click(screen.getByRole("button", { name: "Focus on input" }));

    expect(input).toHaveFocus();
  });
});
