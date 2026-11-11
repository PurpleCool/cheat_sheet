import { describe, expect, it } from "vitest";
import flattenMenu from "./flattenMenu";
import { scenarios } from "./scenarios";

describe("flattenMenu", () => {
  it.each(scenarios)("$name: result and input immutability", ({ input, expected }) => {
    const items = structuredClone(input);
    const before = structuredClone(items);

    expect(flattenMenu(items)).toEqual(expected);
    expect(items).toEqual(before);
    expect(flattenMenu(items)).toEqual(expected);
  });
});
