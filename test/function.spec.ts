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

  it("overloads", () => {
    function makeDate(timestamp: number): Date;
    function makeDate(m: number, d: number, y: number): Date;

    // The implementation signature is not visible from the outside.
    // You should always have two or more signatures above the implementation signature.
    function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
      if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
      } else {
        return new Date(mOrTimestamp);
      }
    }

    const d1 = makeDate(12345678);
    const d2 = makeDate(5, 5, 5);
    expect(d1).to.eql(new Date(12345678));
    expect(d2).to.eql(new Date(5, 5, 5));
  });
});
