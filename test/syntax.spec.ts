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
});

