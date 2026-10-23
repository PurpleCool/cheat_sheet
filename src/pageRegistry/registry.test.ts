import { globSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { pageModules, pageRegistry } from "./registry";

describe("Vite page discovery", () => {
  it("discovers exactly every page marker on disk", () => {
    const files = globSync("**/page.ts", { cwd: resolve(process.cwd(), "src/pages") })
      .map((file) => `../pages/${file.replaceAll("\\", "/")}`)
      .sort();

    expect(Object.keys(pageModules).sort()).toEqual(files);
  });

  it("discovers Home and the moved lessons while ignoring support files", () => {
    const files = Object.keys(pageModules);
    expect(files).toEqual(expect.arrayContaining([
      "../pages/home/page.ts",
      "../pages/hooks/useContextPage/page.ts",
      "../pages/hooks/useRefPage/page.ts",
    ]));
    for (const file of files) {
      expect(file).toMatch(/^\.\.\/pages\/(?:.+\/)?page\.ts$/);
    }
    for (const helper of [
      "../pages/home/index.ts",
      "../pages/hooks/useContextPage/example.ts",
      "../pages/hooks/useContextPage/result/result.tsx",
      "../pages/hooks/useContextPage/result/result.css",
      "../pages/hooks/useRefPage/examples.test.tsx",
    ]) {
      expect(files).not.toContain(helper);
    }

    expect(pageRegistry.home).toMatchObject({ title: "Home", path: "/" });
    expect(pageRegistry.pages.map(({ title, path }) => ({ title, path }))).toEqual(expect.arrayContaining([
      { title: "Home", path: "/" },
      { title: "useContext", path: "/useContext" },
      { title: "useRef", path: "/useRef" },
    ]));
    expect(pageRegistry.navigation).toEqual(expect.arrayContaining([expect.objectContaining({
      kind: "group",
      id: "group:hooks",
      title: "Hooks",
      children: expect.arrayContaining([
        { kind: "page", id: "page:hooks/useContextPage", title: "useContext", path: "/useContext" },
        { kind: "page", id: "page:hooks/useRefPage", title: "useRef", path: "/useRef" },
      ]),
    })]));
  });

  it("registers exactly one route for every discovered page descriptor", () => {
    const descriptors = Object.keys(pageModules).sort().map((file) => pageModules[file]);
    expect(pageRegistry.pages.map(({ title, path, component }) => ({ title, path, component })))
      .toEqual(descriptors);
    expect(new Set(pageRegistry.pages.map(({ id }) => id)).size).toBe(descriptors.length);
  });
});
