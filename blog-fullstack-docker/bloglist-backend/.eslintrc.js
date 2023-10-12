module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true,
    "jest": true,
    "cypress/globals": true
  },
  settings: {
    version: "^18.1.0",
  },
  "extends": [
    "eslint:recommended",
  ],
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "plugins": [ "jest", "cypress"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "eqeqeq": "error",
    "object-curly-spacing": [
      "error", "always"
    ],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-console": 0,
  }
};
