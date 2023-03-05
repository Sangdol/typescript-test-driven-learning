import "mocha";
import sinon from "sinon";

describe("sinon", () => {
  it("should work", () => {
    const spy = sinon.spy();
    spy();
    spy.should.have.been.calledOnce;
  });
});
