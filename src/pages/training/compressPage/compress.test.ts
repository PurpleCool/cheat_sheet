import { describe, expect, it } from "vitest";
import compress from "./compress";

describe("compress", () => {
  it.each([
    [[1, 4, 3, 2], "1-4"],
    [[1, 4], "1, 4"],
    [[1, 2, 3, 6, 7, 10], "1-3, 6-7, 10"],
    [[-3, -2, -1, 2], "-3--1, 2"],
    [[1, 1, 2, 3], "1-3"],
    [[], ""],
  ])("compresses %j to %s", (numbers, expected) => {
    expect(compress(numbers)).toBe(expected);
  });

  it("does not change the input array", () => {
    const numbers = [4, 1, 3, 2, 2];

    compress(numbers);

    expect(numbers).toEqual([4, 1, 3, 2, 2]);
  });
});
