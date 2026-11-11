import { describe, expect, it } from "vitest";
import getUserStats from "./getUserStats";
import { scenarios } from "./scenarios";

describe("getUserStats", () => {
  it.each(scenarios)("$name", ({ input, expected }) => {
    expect(getUserStats(structuredClone(input))).toEqual(expected);
  });

  it("does not change the input array or its objects", () => {
    const input = structuredClone(scenarios[0].input);
    const before = structuredClone(input);
    input.forEach(Object.freeze);
    Object.freeze(input);
    expect(getUserStats(input)).toEqual(scenarios[0].expected);
    expect(input).toEqual(before);
  });
});
