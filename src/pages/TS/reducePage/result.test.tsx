import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Result from "./result";

describe("reduce demo", () => {
  it("runs every scenario independently and shows its result", async () => {
    const user = userEvent.setup();
    render(<Result />);

    const buttons = [
      screen.getByRole("button", { name: "Запустить reduce: Сумма чисел" }),
      screen.getByRole("button", { name: "Запустить reduce: Длинные слова" }),
      screen.getByRole("button", { name: "Запустить reduce: Пользователи по id" }),
    ];
    const outputs = [
      screen.getByRole("status", { name: "Результат: Сумма чисел" }),
      screen.getByRole("status", { name: "Результат: Длинные слова" }),
      screen.getByRole("status", { name: "Результат: Пользователи по id" }),
    ];

    expect(buttons).toHaveLength(3);
    outputs.forEach((output) => {
      expect(output).toHaveTextContent("Ещё не запускался.");
    });

    await user.click(buttons[0]);
    expect(outputs[0]).toHaveTextContent("21");
    expect(outputs[1]).toHaveTextContent("Ещё не запускался.");

    await user.click(buttons[1]);
    expect(within(outputs[1]).getByText(/typescript/)).toBeVisible();
    expect(outputs[1]).toHaveTextContent("generic");
    expect(outputs[1]).toHaveTextContent("callback");

    await user.click(buttons[2]);
    expect(outputs[2]).toHaveTextContent('"101"');
    expect(outputs[2]).toHaveTextContent('"Ada"');
    expect(outputs[2]).toHaveTextContent('"Grace"');
    expect(outputs[2]).toHaveTextContent('"Linus"');
  });
});
