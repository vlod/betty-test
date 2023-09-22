//@ts-check
import { expect, describe, it } from "vitest";
import { sum } from "../src/sum";

describe("sum", () => {
  it("should calculate additions", () => {
    expect(sum(11, 31)).toBe(42);
  });
});
