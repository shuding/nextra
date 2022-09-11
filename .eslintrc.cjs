module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  reportUnusedDisableDirectives: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  overrides: [
    {
      // TODO: enable for `nextra-theme-blog` also
      files: 'packages/nextra-theme-docs/**/*',
      plugins: ['typescript-sort-keys'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            name: 'next/link',
            message: 'Use local <Anchor /> instead'
          }
        ]
      }
    },
    {
      files: 'packages/nextra/src/**/*',
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['fs', 'node:fs'],
                message: 'Use `graceful-fs` instead'
              }
            ]
          }
        ]
      }
    }
  ]
}
