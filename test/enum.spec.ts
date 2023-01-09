import {expect} from "chai";

import {EnumValues} from "enum-values";

it("Defautl Enum", () => {
  enum Color {Red, Green, Blue}
  const c: Color = Color.Red;
  expect(`${c} ${Color[c]}`).to.equal("0 Red");
  expect(Color["Red"]).to.equal(Color.Red);
  expect(Color[0]).to.equal("Red");
  expect(Color[0]).not.to.equal(Color.Red);
  expect(Color.Red).to.equal(0);
});

it("String Enum", () => {
  enum StringColor {Red = "RedValue"}
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

// https://github.com/Microsoft/TypeScript/issues/17198
// https://stackoverflow.com/questions/18111657/how-does-one-get-the-names-of-typescript-enum-entries
it("String Enum iteration", () => {
  enum Color {red = "1", blue = "2"}

  let count = 0;
  for (const color in Color) {
    // red, blue
    count++;
  }

  expect(count).to.equal(2);
});

it("Default Enum iteration", () => {
  enum Color {red, blue}

  let count = 0;
  for (const color in Color) {
    // 0, 1, red, blue
    count++;
  }

  expect(count).to.equal(4);
});

// https://github.com/slavik57/enum-values
it("enum values", () => {
  enum Color {red = "1", blue = "2"}

  expect(EnumValues.getValues(Color)).to.eql(["1", "2"]);
});
