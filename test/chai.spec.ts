import "mocha";
import { expect } from "chai";

describe("chai", function (this: Mocha.Suite) {
  it("Basic", () => {
    expect(true).to.be.true;
    expect(false).to.be.false;
    expect(1).to.be.a("number");
    expect("abc").to.be.a("string");
    expect({}).to.be.an("object");
    expect([]).to.be.an("array");
    expect(null).to.be.null;
    expect(undefined).to.be.undefined;
    expect(new Error()).to.be.an("error");
    expect(new Date()).to.be.an("date");
    expect(/a/).to.be.an("regexp");
  });

  it("Deep equality", () => {
    // Strict equality
    expect([1, 2, 3]).to.not.equal([1, 2, 3]);
    expect({ a: 1 }).to.not.equal({ a: 1 });

    // Deep equality
    expect([1, 2, 3]).to.deep.equal([1, 2, 3]);
    expect([1, 2, 3]).to.eql([1, 2, 3]);
    expect({ a: 1 }).to.deep.equal({ a: 1 });

    // Unordered equality
    expect([1, 2, 3]).to.have.members([2, 1, 3]);
    expect([1, 2, 3]).to.include.members([2, 1]);
    expect([1, 2, 3]).to.not.include.members([4, 5]);
    expect([1, 2, 3]).to.have.ordered.members([1, 2, 3]);
    expect([1, 2, 3]).to.not.have.ordered.members([2, 1, 3]);
  });

  it("Object", () => {
    expect({ a: 1 }).to.have.property("a");
    expect({ a: 1 }).to.have.property("a", 1);
    expect({ a: 1 }).to.have.own.property("a");
    expect({ a: 1 }).to.have.own.property("a", 1);
    expect({ a: 1 }).to.have.any.keys("a", "b");
    expect({ a: 1 }).to.have.all.keys("a");
    expect({ a: 1 }).to.include({ a: 1 });
    expect({ a: 1 }).to.deep.include({ a: 1 });
    expect({ a: 1 }).to.include.any.keys("a", "b");
    expect({ a: 1 }).to.include.all.keys("a");
    expect({ a: 1 }).to.not.be.empty;
  });

  it("satisfy", () => {
    expect(Math.random()).to.satisfy((value: number) => {
      return 0 <= value && value < 1;
    });
  });
});

