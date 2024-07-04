import "mocha";
import chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

// https://github.com/chaijs/chai-as-promised
describe("chai-as-promised", function (this: Mocha.Suite) {
  it("should work", async () => {
    await expect(Promise.resolve(42)).to.eventually.equal(42);
    await expect(Promise.reject(new Error("foo"))).to.be.rejectedWith(Error, "foo");
  });
});

