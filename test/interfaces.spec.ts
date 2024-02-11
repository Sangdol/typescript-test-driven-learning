import "mocha";
import { expect } from "chai";

describe("interfaces", function (this: Mocha.Suite) {
  it("Basic", () => {
    interface LabeledValue {
      label: string;
    }

    const returnLabel = (obj: LabeledValue) => {
      return obj.label;
    };

    // No other properties are allowed from TypeScript 1.6
    // https://stackoverflow.com/questions/31816061/why-am-i-getting-an-error-object-literal-may-only-specify-known-properties
    expect(returnLabel({ label: "hi" })).to.equal("hi");
  });

  it("Index signature", () => {
    interface StringArray {
      [index: number]: string;
    }

    const arr: StringArray = ["a", "b"];
    expect(arr[0]).to.equal("a");
  });

  it("Excess Property Checks", () => {
    // https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks
    interface Person {
      name: string;
      age: number;
    }

    const p: Person = {
      name: "name",
      age: 10,
      // @ts-expect-error Error: Object literal may only specify known properties
      occupation: "occupation",
      // Error: Type '{ name: string; age: number; occupation: string; }'
      // has no properties in common with type 'Person'.
    };
    expect(p.name).to.equal("name");

    // Solution: type assertion
    const p2: Person = {
      name: "name",
      age: 10,
      occupation: "occupation",
    } as Person;

    expect(p2.name).to.equal("name");
  });

  it("Intersection Types", () => {
    interface Colorful {
      color: string;
    }

    interface Circle {
      radius: number;
    }

    type ColorfulCircle = Colorful & Circle;

    const draw = (circle: ColorfulCircle) => {
      return `Drawing a ${circle.color} circle with radius ${circle.radius}`;
    };

    expect(draw({ color: "red", radius: 10 })).to.equal(
      "Drawing a red circle with radius 10"
    );
  });
});
