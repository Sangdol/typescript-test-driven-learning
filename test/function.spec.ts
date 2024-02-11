import "mocha";
import { expect } from "chai";

describe("Generic Functions", function (this: Mocha.Suite) {
  it("generic functions", () => {
    function firstElement<T>(arr: T[]): T {
      return arr[0];
    }

    expect(firstElement([1, 2, 3])).to.equal(1);
    expect(firstElement(["a", "b", "c"])).to.equal("a");

    function map<T, U>(arr: T[], func: (arg: T) => U): U[] {
      return arr.map(func);
    }

    const parsed = map(["1", "2", "3"], (n) => parseInt(n));
    expect(parsed).to.eql([1, 2, 3]);
  });

  it("constraints", () => {
    // T extends { length: number } means that T must have a length property
    function longest<T extends { length: number }>(a: T, b: T): T {
      if (a.length >= b.length) {
        return a;
      } else {
        return b;
      }
    }

    expect(longest([1, 2], [1, 2, 3])).to.eql([1, 2, 3]);
    expect(longest("abc", "ab")).to.equal("abc");
  });

  it("specifying type arguments", () => {
    function combine<T>(arr1: T[], arr2: T[]): T[] {
      return arr1.concat(arr2);
    }

    // T is inferred from the arguments.
    // This doesn't work without the type argument: "Type 'string' is not assignable to type 'number'."
    const arr = combine<number | string>([1, 2], ["a", "b"]);
    expect(arr).to.eql([1, 2, "a", "b"]);
  });
});
