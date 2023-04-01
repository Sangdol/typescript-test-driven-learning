import "mocha";
import { expect } from "chai";


/**
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#enums
 * https://www.typescriptlang.org/docs/handbook/enums.html
 *
 * - It's not a type-level extension; it's added to the language and runtime.
 * - Hold off on using unless you are sure.
 */
describe("Enum", function (this: Mocha.Suite) {
  it("Defautl Enum", () => {
    enum Color { Red, Green, Blue }
    const c: Color = Color.Red;
    expect(`${c} ${Color[c]}`).to.equal("0 Red");
    expect(Color["Red"]).to.equal(Color.Red);
    expect(Color[0]).to.equal("Red");
    expect(Color[0]).not.to.equal(Color.Red);
    expect(Color.Red).to.equal(0);
  });

  it("String Enum", () => {
    enum StringColor { Red = "RedValue" }
    const sc: StringColor = StringColor["Red"];
    expect(sc).to.equal(StringColor.Red);
    expect(StringColor.Red).to.equal("RedValue");

    const stringRed: string = StringColor.Red;
    expect(stringRed).to.equal("RedValue");

    const scValue: StringColor = StringColor["RedValue"];
    expect(scValue).to.equal(undefined);

    const scAny: string = StringColor[<any>"Red"];
    expect(scAny).to.equal("RedValue");
    expect(scAny).to.equal(StringColor.Red);

    const nullSc: StringColor = StringColor["any"];
    expect(nullSc).to.equal(undefined);
  });

  it("String to Enum", () => {
    enum StringColor { Red = "RedValue" }
    const sc: StringColor = "RedValue" as StringColor;

    expect(sc).to.equal(StringColor.Red);

    // No error?
    const sc2: StringColor = "RedValueWrong" as StringColor;
    expect(sc2).to.equal("RedValueWrong");
  });

  // https://github.com/Microsoft/TypeScript/issues/17198
  // https://stackoverflow.com/questions/18111657/how-does-one-get-the-names-of-typescript-enum-entries
  it("String Enum iteration", () => {
    enum Color { red = "1", blue = "2" }

    let count = 0;
    for (const color in Color) {
      // red, blue
      count++;
    }

    expect(count).to.equal(2);
  });

  it("Default Enum iteration", () => {
    enum Color { red, blue }

    let count = 0;
    for (const color in Color) {
      // 0, 1, red, blue
      count++;
    }

    expect(count).to.equal(4);
  });
});
