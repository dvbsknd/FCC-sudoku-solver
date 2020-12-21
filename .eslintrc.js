module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'only-multiline'],
    semi: ['error', 'always'],
  },
  globals: {
    __dirname: true
  }
};
