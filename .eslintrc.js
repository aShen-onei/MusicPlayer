module.exports = {
    root: true,
    parser:"vue-eslint-parser",
    parserOptions: {
      sourceType: 'module',
      "parser": "babel-eslint",
    },
    env: {
      browser: true,

    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
      'html',
      'vue'
    ],
    // add your custom rules here
    'rules': {
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'eol-last': 0,
      'space-before-function-paren': 0,
      "prefer-const": 0,
      "quote-props":0
    }
  }