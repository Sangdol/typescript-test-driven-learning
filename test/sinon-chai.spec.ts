/**
 * https://www.chaijs.com/plugins/sinon-chai/
 */
import "mocha";
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";

chai.use(sinonChai);

/**
 * https://sinonjs.org/releases/latest/stubs/
 */
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

  it("should work with createStubInstance", () => {
    class Foo {
      bar() {
        return 42;
      }
    }

    // If you want to create a stub object of MyConstructor, 
    // but don’t want the constructor to be invoked, use this utility function.
    const stub = sinon.createStubInstance(Foo);
    stub.bar.returns(42);
    stub.bar();
    expect(stub.bar).to.be.called;
  });
});

/**
 * https://sinonjs.org/releases/latest/mocks/
 */
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

/**
 * https://sinonjs.org/releases/latest/spies/
 */
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

/**
 * https://sinonjs.org/releases/latest/fakes/
 */
describe("sinon-chai fake", function (this: Mocha.Suite) {
  it("should work", () => {
    const fake = sinon.fake();
    fake();
    expect(fake).to.be.called;
  });

  it("should work with obj", () => {
    const obj = {
      foo() {
        return 42;
      },
    };
    const fake = sinon.fake(obj.foo);

    sinon.replace(obj, "foo", fake);

    obj.foo();
    obj.foo();

    expect(fake).to.be.calledTwice;

    sinon.restore();

    obj.foo();
    expect(fake).to.be.calledTwice;
  });
});
