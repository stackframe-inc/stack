module.exports = {
  "extends": [
    "../../eslint-configs/defaults.js",
  ],
  "ignorePatterns": ['/*', '!/src'],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
};
