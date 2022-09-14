module.exports = {
  env: {
    'node': true,
    'es6': true,
    'browser': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
  ],
 
  plugins: [
    'react',
    'prettier',
    '@typescript-eslint'
  ],
  rules: {
    'eqeqeq': 'error',
    'no-console': 'warn',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  'parser': '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  ignorePatterns: [
    node_modules,
    build,
    dist,
    public
  ]
}
