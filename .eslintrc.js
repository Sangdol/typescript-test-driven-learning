module.exports = {
  env: {
    browser: false, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    node: true, // Defines things like process.env when generating through node
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser", // Uses babel-eslint transforms.
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  plugins: ["@typescript-eslint"],
  root: true, // For configuration cascading.
  rules: {
    "no-restricted-syntax": [
      // https://eslint.org/docs/latest/rules/no-restricted-syntax
      "error",
      {
        selector:
          "CallExpression[callee.object.name='describe'][callee.property.name='only']",
        message: "describe.only is not allowed.",
      },
      {
        selector:
          "CallExpression[callee.object.name='it'][callee.property.name='only']",
        message: "it.only is not allowed.",
      },
    ],
  },
  settings: {},
};
