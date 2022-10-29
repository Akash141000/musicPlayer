module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        quotes: ['error', 'single'],
        'no-unused-declaration': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'error',
        'no-unsafe-optional-chaining': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            prefix: ['I'],
          },
        ],
      },
    },
  ],
};
