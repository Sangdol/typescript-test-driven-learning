import "mocha";
import { expect } from "chai";

// Ignore all type-checking errors for explaining the TS types.
/* eslint-disable */

/**
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 */
describe("Everyday Types", function (this: Mocha.Suite) {
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
        // type guard
        return id.toUpperCase();
      } else {
        return id;
      }
    }

    expect(pringId("abc")).to.equal("ABC");
    expect(pringId(1)).to.equal(1);
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

    // Extending types via intersection
    type Animal = {
      name: string;
    };

    type Bear = Animal & {
      honey: boolean;
    };

    const bear: Bear = { name: "bear", honey: true };
    expect(`${bear.name} ${bear.honey}`).to.equal("bear true");
  });

  it("Interfaces", () => {
    interface Point {
      x: number;
      y: number;
    }

    const point: Point = { x: 1, y: 2 };
    expect(`${point.x} ${point.y}`).to.equal("1 2");

    // Extending interfaces via extends
    interface Point3D extends Point {
      z: number;
    }

    const point3D: Point3D = { x: 1, y: 2, z: 3 };
    expect(`${point3D.x} ${point3D.y} ${point3D.z}`).to.equal("1 2 3");
  });

  it("Type Assertions", () => {
    const someValue: any = "this is a string";
    const strLength: number = (<string>someValue).length;
    expect(strLength).to.equal(16);

    const someValue2: any = "this is a string";
    const strLength2: number = (someValue2 as string).length;
    expect(strLength2).to.equal(16);

    interface Point {
      x: number;
      y: number;
    }
    // Coercion
    const point: Point = {} as any as Point;
    point.x = 1;
    point.y = 2;
    expect(`${point.x} ${point.y}`).to.equal("1 2");
  });

  it("Literal Types", () => {
    type Direction = "North" | "East" | "South" | "West";
    const direction: Direction = "North";
    expect(direction).to.equal("North");

    // Numeric Literal Types
    type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    const digit: Digit = 1;
    expect(digit).to.equal(1);

    // Literal Type to string
    function move(distance: number, direction: Direction) {
      return `${distance} ${direction}`;
    }

    // Avoiding "Argument of type 'string' is not assignable to parameter of type Direction."
    const wrappedNorth1 = { North: "North" as "North" };
    expect(move(1, wrappedNorth1.North)).to.equal("1 North");

    const wrappedNorth2 = { North: "North" } as const;
    expect(move(2, wrappedNorth2.North)).to.equal("2 North");
  });

  it("Non-null assertion operator", () => {
    function liveDangerously(x?: number | null) {
      // Avoiding "Object is possibly 'null'."
      return x!.toFixed();
    }

    expect(liveDangerously(1)).to.equal("1");
  });

  it("symbol", () => {
    const s1 = Symbol("s");
    const s2 = Symbol("s");

    expect(s1).to.be.not.equal(s2);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
describe("Advanced Types", () => {
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
      x: number;
      y: number;
    }

    interface Named {
      name: string;
    }

    const obj = {
      x: 1,
      y: 2,
      name: "abc",
    };

    function add(point: PointLike) {
      return point.x + point.y;
    }

    function name(named: Named) {
      return named.name;
    }

    // TS's type system is structural, not nominal.
    expect(add(obj)).to.be.equal(3);
    expect(name(obj)).to.be.equal("abc");

    interface Empty {}

    function empty(e: Empty) {
      return "";
    }

    // This is not a problem as well.
    expect(empty(obj)).to.be.equal("");
  });

  it("Identical types", () => {
    class Car {
      drive() {
        return "car";
      }
    }

    class Golfer {
      drive() {
        return "golfer";
      }
    }

    // This is also not a problem.
    const car: Car = new Golfer();

    expect(car.drive()).to.be.equal("golfer");
  });

  it("Reflection not possible", () => {
    class Car {
      drive() {
        return "car";
      }
    }

    const car: Car = new Car();

    // TS's typs system is not reified. No type information at runtime.
    // No "Car".
    expect(typeof car).to.be.equal("object");
  });

  it("unknown", () => {
    const value: unknown = "string";
    // This is not a problem.
    expect((value as string).length).to.be.equal(6);

    // This is a problem.
    // expect(value.length).to.be.equal(6);
    // Property 'length' does not exist on type 'unknown'.

    function processValue(value: unknown) {
      if (typeof value === "string") {
        return value.toUpperCase();
      } else if (typeof value === "number") {
        return value.toFixed(2);
      } else {
        return "";
      }
    }

    expect(processValue("string")).to.be.equal("STRING");
    expect(processValue(1)).to.be.equal("1.00");
  });

  it("never", () => {
    function error(message: string): never {
      throw new Error(message);
    }

    // This is not a problem.
    expect(() => error("error")).to.throw("error");
  });
});
