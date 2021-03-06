// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    "comma-dangle": ["error", "only-multiline"],
    "indent": ["error", 2],
    "max-len": [1, 160, 2, {ignoreComments: true}],
    "quote-props": [1, "consistent-as-needed"],
    "no-cond-assign": [2, "except-parens"],
    "radix": 0,
    "space-infix-ops": 0,
    "no-unused-vars": [1, {"vars": "local", "args": "none"}],
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    "default-case": 0,
    "no-else-return": 0,
    "no-param-reassign": 0,
    "prefer-template": 0,
    "prefer-const": 0,
    "no-var": 0,
    "no-multiple-empty-lines": [2, {"max": 2, "maxEOF": 1}],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
