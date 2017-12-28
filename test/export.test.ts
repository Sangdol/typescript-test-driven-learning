import * as math from "../src/export";
import { add } from "../src/export";
import { add as Add } from "../src/export";

describe("math", () => {
  it("should add", () => {
    expect(math.add(1, 2)).toBe(3);
    expect(add(1, 2)).toBe(3);
    expect(Add(1, 2)).toBe(3);
  });
});