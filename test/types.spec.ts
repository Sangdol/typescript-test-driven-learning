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

    expect(`${isBoolean} ${n} ${name} ${list} ${tuple}`).to.equal(
      "true 10 name 1,2 name,1,true"
    );
  });
  it("any", () => {
    const any: any = "string";
    expect(<string>any.length).to.equal(6);
    expect((any as string).length).to.equal(6);
  });

  it("Union", () => {
    const union1: string | number = "abc";
    const union2: string | number = 1;

    expect(`${union1} ${union2}`).to.equal("abc 1");
  });

  it("Union: narrowing", () => {
    function pringId(id: number | string) {
      if (typeof id === "string") {
        return id.toUpperCase();
      } else {
        return id;
      }
    }

    expect(pringId("abc")).to.equal("ABC");
    expect(pringId(1)).to.equal(1);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
describe("Advanced Types", () => {

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
    };

    // Type Predicate: pet is Fish
    const isFish = (pet: Fish | Bird): pet is Fish => {
      return "swim" in pet;
    };

    const pet = getSmallPet();

    expect(isFish(pet)).to.equal(true);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
describe("Utility Types", () => {
  it("Partial", () => {
    type Todo = {
      title: string;
      description: string;
    };

    const updateTodo = (todo: Todo, fieldsToUpdate: Partial<Todo>) => {
      return { ...todo, ...fieldsToUpdate };
    };

    const todo1 = {
      title: "organize desk",
      description: "clear clutter",
    };

    const todo2 = updateTodo(todo1, {
      description: "throw out trash",
    });

    expect(todo2).to.deep.equal({
      title: "organize desk",
      description: "throw out trash",
    });
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html
 */
describe("TS for Java/C# Programmers", () => {
  it("Structural obj type", () => {
    interface PointLike {
      x: number
      y: number
    }

    interface Named {
      name: string
    }

    const obj = {
      x: 1,
      y: 2,
      name: 'abc'
    };

    function add(point: PointLike) {
      return point.x + point.y;
    }

    function name(named: Named) {
      return named.name;
    }

    // TS's type system is structural, not nominal.
    expect(add(obj)).to.be.equal(3);
    expect(name(obj)).to.be.equal('abc');

    interface Empty {}

    function empty(e: Empty) {
      return ''
    }

    // This is not a problem as well.
    expect(empty(obj)).to.be.equal('');
  });

  it("Identical types", () => {
    class Car {
      drive() { return 'car' }
    }

    class Golfer {
      drive() { return 'golfer' }
    }

    // This is also not a problem.
    const car: Car = new Golfer();

    expect(car.drive()).to.be.equal('golfer');
  });

  it("Reflection not possible", () => {
    class Car {
      drive() { return 'car' }
    }

    const car: Car = new Car();

    // TS's typs system is not reified. No type information at runtime.
    // No "Car".
    expect(typeof car).to.be.equal("object");
  });
});
