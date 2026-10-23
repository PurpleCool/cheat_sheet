import { StrictMode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sandpack } from "@codesandbox/sandpack-react";
import { describe, expect, it, vi } from "vitest";
import appSource from "./app.tsx?raw";
import { holyGrailExample } from "./example";
import HolyGrailPage from "./holyGrailPage";
import Result from "./result";
import stylesSource from "./styles.css?raw";

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => <div data-testid="holy-grail-playground" />),
}));

describe("Holy Grail page", () => {
  it("keeps the source visible outside the collapsed, locally restated requirements", async () => {
    const user = userEvent.setup();
    render(<HolyGrailPage />);

    const link = screen.getByRole("link", { name: "Источник: GreatFrontEnd — Holy Grail" });
    expect(link).toHaveAttribute("href", "https://www.greatfrontend.com/questions/user-interface/holy-grail");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toBeVisible();
    expect(link.closest("details")).toBeNull();
    const summary = screen.getByText("Условие задачи", { selector: "summary" });
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    const attribution = within(details).getByText("Требования изложены своими словами, это не точная копия условия.");
    expect(attribution).not.toBeVisible();

    await user.click(summary);
    expect(attribution).toBeVisible();
    expect(details).toHaveTextContent("с помощью CSS, без существенных изменений HTML");
    expect(details).toHaveTextContent("Слева — навигация, в центре — основной контент, справа — боковая панель для рекламы.");
    expect(within(details).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Шапка занимает всю ширину страницы и имеет высоту 60px.",
      "Левая и правая колонки имеют фиксированную ширину 100px каждая.",
      "Ширина центральной колонки гибкая: она занимает оставшееся место.",
      "Высота всех трёх колонок одинакова и определяется самой высокой из них.",
      "Подвал занимает всю ширину страницы и имеет высоту 100px.",
      "При коротком контенте подвал остаётся у нижней границы viewport.",
    ]);
    await user.click(summary);
    expect(details).not.toHaveAttribute("open");
    expect(link).toBeVisible();
    expect(screen.getByText(holyGrailExample.notes![0])).toBeVisible();
  });

  it("displays the exact standalone JSX and CSS sources and passes both to Sandpack", async () => {
    const user = userEvent.setup();
    render(<HolyGrailPage />);
    expect(holyGrailExample.files).toEqual([
      { path: "app.tsx", language: "tsx", source: appSource },
      { path: "styles.css", language: "css", source: stylesSource },
    ]);
    const code = screen.getByRole("tabpanel").querySelector("code")!;
    expect(code).toHaveAttribute("data-source-path", "app.tsx");
    expect(code.textContent).toBe(appSource);
    await user.click(screen.getByRole("tab", { name: "styles.css" }));
    expect(code).toHaveAttribute("data-source-path", "styles.css");
    expect(code.textContent).toBe(stylesSource);

    expect(screen.queryByTestId("holy-grail-playground")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit in playground" }));
    expect(await screen.findByTestId("holy-grail-playground")).toBeVisible();
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      files: { "/App.tsx": appSource, "/styles.css": stylesSource },
      template: "react-ts",
    }), undefined);
  });
});

describe("Holy Grail isolated preview", () => {
  it("portals the original app and exact stylesheet only into the loaded iframe", () => {
    const { container } = render(<Result />);
    const frame = screen.getByTitle<HTMLIFrameElement>("Holy Grail layout preview");
    expect(frame).toHaveAttribute("sandbox", "allow-same-origin");
    expect(frame.srcdoc).toContain('<html lang="en">');
    expect(frame.srcdoc).not.toContain("<script");
    expect(frame.contentDocument!.body).toBeEmptyDOMElement();
    fireEvent.load(frame);
    const body = frame.contentDocument!.body;
    expect(body.querySelector("style")!.textContent).toBe(stylesSource);
    expect(Array.from(body.children, (element) => element.tagName)).toEqual([
      "STYLE", "HEADER", "DIV", "FOOTER",
    ]);
    expect(within(body).getByRole("banner")).toHaveTextContent("Header");
    expect(within(body).getByRole("navigation")).toHaveTextContent("Navigation");
    expect(within(body).getByRole("main")).toHaveTextContent("Main");
    expect(within(body).getByRole("complementary")).toHaveTextContent("Sidebar");
    expect(within(body).getByRole("contentinfo")).toHaveTextContent("Footer");
    expect(body.querySelector(".main-content")!.children).toHaveLength(3);
    expect(container.querySelector("header, nav, main, aside, footer, style")).toBeNull();
    expect(Array.from(document.querySelectorAll("style"))).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ textContent: stylesSource })]),
    );
    // A repeated load for the same document must not duplicate portal content.
    fireEvent.load(frame);
    expect(body.querySelectorAll("header")).toHaveLength(1);
    expect(body.querySelectorAll("style")).toHaveLength(1);
  });

  it("handles an unavailable iframe document without rendering into the host", () => {
    const { container } = render(<Result />);
    const frame = screen.getByTitle<HTMLIFrameElement>("Holy Grail layout preview");
    Object.defineProperty(frame, "contentDocument", { configurable: true, value: null });
    expect(() => fireEvent.load(frame)).not.toThrow();
    expect(container.querySelector(".main-content, style")).toBeNull();
  });

  it("cleans up portals on unmount and renders a fresh preview under StrictMode", () => {
    const first = render(<StrictMode><Result /></StrictMode>);
    const frame = screen.getByTitle<HTMLIFrameElement>("Holy Grail layout preview");
    fireEvent.load(frame);
    const oldBody = frame.contentDocument!.body;
    expect(oldBody.querySelector("main")).toHaveTextContent("Main");
    first.unmount();
    expect(oldBody).toBeEmptyDOMElement();

    render(<StrictMode><Result /></StrictMode>);
    const nextFrame = screen.getByTitle<HTMLIFrameElement>("Holy Grail layout preview");
    expect(nextFrame).not.toBe(frame);
    fireEvent.load(nextFrame);
    expect(nextFrame.contentDocument!.body.querySelector("main")).toHaveTextContent("Main");
    expect(oldBody).toBeEmptyDOMElement();
  });
});
