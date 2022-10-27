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
    },
    {
      files: 'packages/nextra-theme-docs/**/*',
      extends: ['plugin:tailwindcss/recommended'],
      rules: {
        'tailwindcss/classnames-order': 'error',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/enforces-shorthand': 'error',
        'tailwindcss/migration-from-tailwind-2': 'error',
        'tailwindcss/no-custom-classname': 'error'
      },
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-docs/tailwind.config.js',
          callees: ['cn'],
          whitelist: ['nextra-breadcrumb']
        }
      }
    }
  ]
}
