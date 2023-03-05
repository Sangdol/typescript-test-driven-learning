import "mocha";
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";

chai.use(sinonChai);

describe("sinon-chai stub", function (this: Mocha.Suite) {
  it("should work", () => {
    const stub = sinon.stub();
    stub.returns(42);
    stub();
    expect(stub).to.be.called;
  });

  it("should work with obj", () => {
    const obj = {
      foo() {
        return 42;
      },
    };
    const stub = sinon.stub(obj, "foo").returns(42);
    obj.foo();
    obj.foo();
    expect(stub).to.be.calledTwice;
    stub.restore();
    obj.foo();
    expect(stub).to.be.calledTwice;
  });
});

describe("sinon-chai mock", function (this: Mocha.Suite) {
  it("should work", () => {
    const myObj = {
      foo() {
        return 42;
      },
    };

    const mock = sinon.mock(myObj);
    mock.expects("foo").once().returns(42);

    myObj.foo();
    mock.verify();
  });
});

describe("sinon-chai spy", function (this: Mocha.Suite) {
  it("should work", () => {
    const spy = sinon.spy();
    spy();
    expect(spy).to.be.called;
  });

  it("should work with obj", () => {
    const obj = {
      foo() {
        return 42;
      },
    };
    const spy = sinon.spy(obj, "foo");
    obj.foo();
    obj.foo();
    expect(spy).to.be.calledTwice;
    spy.restore();
    obj.foo();
    expect(spy).to.be.calledTwice;
  });
});
