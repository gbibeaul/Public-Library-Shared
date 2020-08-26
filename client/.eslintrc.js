module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-redux/recommended",
    "plugin:node/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-redux"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "node/no-extraneous-require": [
      "error",
      {
        allowModules: ["express"],
      },
    ],
    "node/no-unsupported-features/es-syntax": "off",
  },
};
