import "mocha";
import { expect } from "chai";

/**
 * https://www.typescriptlang.org/docs/handbook/type-compatibility.html
 */
describe("Type Compatibility", function (this: Mocha.Suite) {
  it("Structural subtyping", () => {
    interface Pet {
      name: string;
    }

    class Dog {
      name!: string;
    }

    let pet: Pet;
    pet = new Dog();

    expect(pet).to.be.instanceOf(Dog);

    // This is not possible:
    //   Type '{ name: string; owner: string; }' is not assignable to type 'Pet'.
    //   Object literal may only specify known properties, and 'owner' does not exist in type 'Pet'. (tsserver 2322)
    //   (Excessive property check)
    // pet = { name: "Fido", owner: "John" };

    // But it's possible
    const dog = { name: "Fido", owner: "John" };
    pet = dog;
    expect(pet).to.deep.equal({ name: "Fido", owner: "John" });

    // This is also possible
    function greet(pet: Pet) {
      return `Hello, ${pet.name}`;
    }
    expect(greet(dog)).to.equal("Hello, Fido");
  });
});
