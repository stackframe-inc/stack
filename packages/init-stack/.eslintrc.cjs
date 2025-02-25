const defaults = require("../../eslint-configs/defaults.js");

module.exports = {
  "extends": [
    "../../eslint-configs/defaults.js",
  ],
  "ignorePatterns": ['/*', '!/src'],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "no-restricted-syntax": [
      ...defaults.rules["no-restricted-syntax"],
    ],
  },
};
