import "mocha";
import { expect } from "chai";

/* eslint-disable */

describe("Prototypes", () => {
  /**
   * https://miro.com/app/board/uXjVNdWbpgU=/?moveToWidget=3458764579007190494&cot=14
   */
  it("function prototype chain", () => {
    function Pet(name: string) {
      // @ts-ignore
      this.name = name;
    }

    Pet.prototype.getName = function () {
      return this.name;
    };

    function Dog(name: string, breed: string) {
      // @ts-ignore
      Pet.call(this, name);
      // @ts-ignore
      this.breed = breed;
    }

    // Same as Dog.prototype.__proto__ = Pet.prototype;
    Dog.prototype = Object.create(Pet.prototype);

    Dog.prototype.getBreed = function () {
      return this.breed;
    };

    const dog = new Dog("Fido", "Golden Retriever");

    //
    // prototype chain
    //
    expect(dog.getName()).to.equal("Fido");
    expect(dog.__proto__).to.equal(Dog.prototype);
    expect(dog.prototype).to.equal(undefined);

    expect(dog.__proto__.__proto__).to.equal(Pet.prototype);
    expect(Dog.prototype.__proto__).to.equal(Pet.prototype);

    expect(dog.__proto__.__proto__.__proto__).to.equal(Object.prototype);
    expect(Pet.prototype.__proto__).to.equal(Object.prototype);

    expect(dog.__proto__.__proto__.__proto__.__proto__).to.equal(null);
    // @ts-ignore
    expect(Object.prototype.__proto__).to.equal(null);

    //
    // Function: every function is a Function object
    //
    // @ts-ignore
    expect(Dog.__proto__).to.equal(Function.prototype);
    // @ts-ignore
    expect(Function.prototype.__proto__).to.equal(Object.prototype);
  });

  it("class prototype", () => {
    class Pet {
      constructor(public name: string) {}

      getName() {
        return this.name;
      }
    }

    class Dog extends Pet {
      constructor(name: string, public breed: string) {
        super(name);
      }

      getBreed() {
        return this.breed;
      }
    }

    expect(Dog.prototype.getBreed).to.be.a("function");
    expect(Dog.prototype.getName).to.be.a("function");
    expect(Dog.prototype.constructor).to.equal(Dog);
    expect(Dog.prototype.getName).to.equal(Pet.prototype.getName);
  });
});
