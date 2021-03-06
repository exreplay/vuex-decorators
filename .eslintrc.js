module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
      ecmaFeatures: {
          legacyDecorators: true
      }
  },
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  'plugins': [
    'jest'
  ],
  rules: {
    'import/no-unresolved': 0,

    'array-bracket-spacing': ["error", "always"],

    'no-useless-catch': 0,
    
    "indent": ["error", 2, { "MemberExpression": "off" }],
    
    'generator-star-spacing': 'off',
    
    "no-tabs": "off",

    "prefer-promise-reject-errors": ["error", {
        "allowEmptyReject": true
    }],

    "no-multi-spaces": ["error", {
        exceptions: {
            "ImportDeclaration": true
        }
    }],

    "semi": ["error", "always"],

    "space-before-function-paren": ["error", "never"],
    
    "no-trailing-spaces": ["error", {
        "skipBlankLines": true
    }]
  }
}
