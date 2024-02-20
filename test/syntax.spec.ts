import "mocha";
import { expect } from "chai";

describe("Syntax", function (this: Mocha.Suite) {
  it("?? vs. ||", () => {
    // ??: nullish coalescing operator
    expect(null || 1).to.be.equal(1);
    expect(null ?? 1).to.be.equal(1);
    expect(undefined || 1).to.be.equal(1);
    expect(undefined ?? 1).to.be.equal(1);

    expect(0 || 1).to.be.equal(1);
    expect(0 ?? 1).to.be.equal(0);
    expect(false || 1).to.be.equal(1);
    expect(false ?? 1).to.be.equal(false);
  });

  it("generator", () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }

    const g = gen();
    expect(g.next().value).to.be.equal(1);
    expect(g.next().value).to.be.equal(2);
    expect(g.next().value).to.be.equal(3);
    expect(g.next().done).to.be.true;

    function* gen2() {
      yield* [1, 2, 3];
      return 4;
    }

    const g2 = gen2();
    expect(g2.next().value).to.be.equal(1);
    expect(g2.next().value).to.be.equal(2);
    expect(g2.next().value).to.be.equal(3);
    expect(g2.next().value).to.be.equal(4);
    expect(g2.next().done).to.be.true;
  });
});
