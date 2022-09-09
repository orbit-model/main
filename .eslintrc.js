module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "plugin:prettier/recommended",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module",
    "project": [
      "./tsconfig.json"
    ]
  },
  "rules": {
    //"@typescript-eslint/generic-type-naming": ["error", "^[A-Z]+$"],
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "prefer-const": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  "root": true
};
