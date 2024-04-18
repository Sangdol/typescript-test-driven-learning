import "mocha";
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";

chai.use(sinonChai);

describe("sinon clock", function (this: Mocha.Suite) {
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it("should work", () => {
    const spy = sinon.spy();
    setInterval(spy, 1000);
    clock.tick(1000);
    expect(spy).to.be.calledOnce;
    clock.tick(1000);
    expect(spy).to.be.calledTwice;
  });
});
