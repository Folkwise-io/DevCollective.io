module.exports = {
  root: true,
  plugins: [`import`],
  extends: [`eslint:recommended`, `plugin:import/recommended`],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    "import/no-duplicates": 2,
    "import/no-unresolved": 0,
    "import/order": [
      1,
      {
        groups: [
          [`builtin`, `external`],
          [`internal`, `index`, `object`, `unknown`, `type`],
          [`parent`, `sibling`],
        ],
        pathGroups: [{ pattern: `@app/**`, group: `internal` }],
        pathGroupsExcludedImportTypes: [`builtin`],
        "newlines-between": `always`,
        alphabetize: { order: `asc`, caseInsensitive: true },
      },
    ],
    "prefer-const": 2,
    "no-console": [1, { allow: [`warn`, `error`, `info`] }],
    "no-constant-condition": [2, { checkLoops: false }],
    "no-control-regex": 0,
    "no-empty": [1, { allowEmptyCatch: true }],
    "sort-imports": [1, { ignoreDeclarationSort: true }],
  },
  overrides: [
    {
      files: [`**/*.js`, `**/*.jsx`],
      parser: `@babel/eslint-parser`,
      rules: {
        "no-unused-vars": [1, { argsIgnorePattern: `^_`, ignoreRestSiblings: true, args: `none` }],
        quotes: [2, `backtick`],
      },
    },
    {
      files: [`./src/frontend/**/*`],
      plugins: [`react`, `react-hooks`],
      extends: [`plugin:react/recommended`, `plugin:react-hooks/recommended`],
      env: {
        browser: true,
        node: false,
      },
      settings: {
        react: {
          version: `detect`,
        },
      },
      rules: {
        "react/jsx-uses-react": 0,
        "react/prop-types": 0,
        "react/react-in-jsx-scope": 0,
      },
    },
    {
      files: [`**/*.ts`],
      parser: `@typescript-eslint/parser`,
      plugins: [`@typescript-eslint`],
      extends: [`plugin:@typescript-eslint/recommended`],
      rules: {
        "@typescript-eslint/ban-ts-comment": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/no-unused-vars": [1, { argsIgnorePattern: `^_`, ignoreRestSiblings: true, args: `none` }],
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/quotes": [2, `backtick`],
      },
    },
  ],
};
