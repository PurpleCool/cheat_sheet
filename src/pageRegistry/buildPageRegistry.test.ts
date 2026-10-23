import { describe, expect, it } from "vitest";
import { buildPageRegistry } from "./buildPageRegistry";
import type { PageDefinition } from "./types";

function page(title: string, path: PageDefinition["path"]): PageDefinition {
  return { title, path, component: () => null };
}

const home = { "../pages/home/page.ts": page("Home", "/") };

describe("buildPageRegistry", () => {
  it("uses the UI acronym for the ui directory group", () => {
    const registry = buildPageRegistry({
      ...home,
      "../pages/ui/tabsPage/page.ts": page("Tabs", "/ui/tabs"),
    });

    expect(registry.navigation).toEqual([{
      kind: "group", id: "group:ui", title: "UI", children: [{
        kind: "page", id: "page:ui/tabsPage", title: "Tabs", path: "/ui/tabs",
      }],
    }]);
  });

  it("orders pages and navigation by entry path with stable unique IDs", () => {
    const modules = {
      "../pages/zPage/page.ts": page("Z", "/z"),
      ...home,
      "../pages/aPage/page.ts": page("A", "/a"),
    };
    const registry = buildPageRegistry(modules);
    const reversed = Object.fromEntries(Object.entries(modules).reverse());

    expect(registry).toEqual(buildPageRegistry(reversed));
    expect(registry.pages.map(({ path }) => path)).toEqual(["/a", "/", "/z"]);
    expect(registry.navigation).toEqual([
      { kind: "page", id: "page:aPage", title: "A", path: "/a" },
      { kind: "page", id: "page:zPage", title: "Z", path: "/z" },
    ]);
    expect(new Set(registry.pages.map(({ id }) => id)).size).toBe(3);
    expect(registry.home.path).toBe("/");
  });

  it("keeps every page in nested groups, including repeated folder names", () => {
    const registry = buildPageRegistry({
      ...home,
      "../pages/hooks/basic/page.ts": page("Basic", "/basic"),
      "../pages/hooks/advanced-hooks/effect/page.ts": page("Effect", "/effect"),
      "../pages/data/advanced-hooks/effect/page.ts": page("Data effect", "/dataEffect"),
    });

    expect(registry.navigation).toEqual([
      {
        kind: "group", id: "group:data", title: "Data", children: [{
          kind: "group", id: "group:data/advanced-hooks", title: "Advanced hooks", children: [{
            kind: "page", id: "page:data/advanced-hooks/effect", title: "Data effect", path: "/dataEffect",
          }],
        }],
      },
      {
        kind: "group", id: "group:hooks", title: "Hooks", children: [
          {
            kind: "group", id: "group:hooks/advanced-hooks", title: "Advanced hooks", children: [{
              kind: "page", id: "page:hooks/advanced-hooks/effect", title: "Effect", path: "/effect",
            }],
          },
          { kind: "page", id: "page:hooks/basic", title: "Basic", path: "/basic" },
        ],
      },
    ]);
    expect(registry.pages).toHaveLength(4);
  });

  it("ignores helpers, examples, CSS and tests without the exact page.ts marker", () => {
    const registry = buildPageRegistry({
      ...home,
      "../pages/helpers/index.ts": page("Helper", "/"),
      "../pages/helpers/helper.tsx": page("Helper", "/"),
      "../pages/test/page.test.ts": page("Test", "/"),
      "../pages/example/result/result.tsx": page("Result", "/"),
      "../pages/example/page.tsx": page("Not a marker", "/"),
      "../pages/example/page.css": page("Styles", "/"),
    });

    expect(registry.pages).toHaveLength(1);
    expect(registry.navigation).toEqual([]);
  });

  it.each(["/same", "/SAME"] as const)(
    "rejects duplicate or case-conflicting URL %s with both entry paths",
    (path) => {
      expect(() => buildPageRegistry({
        ...home,
        "../pages/first/page.ts": page("First", "/same"),
        "../pages/second/page.ts": page("Second", path),
      })).toThrow(/Conflicting page path.*first\/page\.ts.*second\/page\.ts/);
    },
  );

  it.each(["/nested/", "/users/:id", "/wild/*", "/query?q=1", "//double"] as const)(
    "rejects ambiguous or non-static URL %s",
    (path) => {
      expect(() => buildPageRegistry({
        ...home,
        "../pages/invalid/page.ts": page("Invalid", path),
      })).toThrow(/Invalid page path.*invalid\/page\.ts/);
    },
  );

  it.each(["../pages/hooks/page.ts", "../pages/page.ts"])(
    "rejects an entry that would hide child pages: %s",
    (entry) => {
      expect(() => buildPageRegistry({
        ...home,
        [entry]: page("Parent", "/parent"),
        "../pages/hooks/child/page.ts": page("Child", "/child"),
      })).toThrow(/has both page\.ts and child pages/);
    },
  );

  it("requires a home page for the brand and fallback route", () => {
    expect(() => buildPageRegistry({})).toThrow(/requires a home page/);
  });
});
