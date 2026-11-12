import { Sandpack } from "@codesandbox/sandpack-react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SandpackPlayground from "./sandpackPlayground";
import type { ExampleDefinition } from "./types";

vi.mock("@codesandbox/sandpack-react", () => ({
  Sandpack: vi.fn(() => null),
}));

const example: ExampleDefinition = {
  id: "basic",
  title: "Basic",
  entry: () => null,
  files: [{ path: "result.tsx", language: "tsx", source: "export default () => null;" }],
  playground: { entryFile: "result.tsx" },
};

describe("Sandpack dependencies", () => {
  it("keeps the existing React setup for lessons without extra dependencies", () => {
    render(<SandpackPlayground example={example} />);
    expect(Sandpack).toHaveBeenLastCalledWith(expect.objectContaining({
      customSetup: { dependencies: { react: "19.3.1", "react-dom": "19.3.1" } },
    }), undefined);
  });
});
