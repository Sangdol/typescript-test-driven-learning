import math from "../src/default-export";

describe("math", () => {
  it("should add", () => {
    expect(math.add(1, 2)).toBe(3);
  });
});