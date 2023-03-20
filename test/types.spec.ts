import "mocha";
import { expect } from "chai";

describe("Basic Types", function (this: Mocha.Suite) {
  /**
   * https://www.typescriptlang.org/docs/handbook/basic-types.html
   */
  it("Basic Types", () => {
    const isBoolean: boolean = true;
    const n: number = 10;
    const name: string = "name";
    const list: number[] = [1, 2];
    const tuple: [string, number, boolean] = ["name", 1, true];

    expect(`${isBoolean} ${n} ${name} ${list} ${tuple}`)
      .to.equal("true 10 name 1,2 name,1,true");
  });
  it("any", () => {
    const any: any = "string";
    expect(<string>any.length).to.equal(6);
    expect((any as string).length).to.equal(6);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
describe("Advanced Types", () => {
  it("Union", () => {
    const union1: string | number = "abc";
    const union2: string | number = 1;

    expect(`${union1} ${union2}`).to.equal("abc 1");
  });

  /**
   * Use interface when it's possible
   */
  it("Type Aliases", () => {
    type Name = string;
    type NameResolver = () => string;
    type NameOrResolver = Name | NameResolver;

    const getName = (n: NameOrResolver): Name => {
      if (typeof n === "string") {
        return n;
      } else {
        return n();
      }
    };

    expect(getName("name")).to.equal("name");
    expect(getName(() => "name")).to.equal("name");
  });

  it("Type Guards / Type Predicates", () => {
    type Fish = { swim: () => string };
    type Bird = { fly: () => string };

    const getSmallPet = (): Fish | Bird => {
      return { swim: () => "swim" };
    }

    // Type Predicate: pet is Fish
    const isFish = (pet: Fish | Bird): pet is Fish => {
      return 'swim' in pet;
    }

    const pet = getSmallPet();

    expect(isFish(pet)).to.equal(true);
  });
});
