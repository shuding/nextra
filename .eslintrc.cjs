const TAILWIND_CONFIG = {
  extends: ['plugin:tailwindcss/recommended'],
  rules: {
    'tailwindcss/classnames-order': 'error',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-custom-classname': 'error'
  }
}

module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: '**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'prefer-object-has-own': 'error'
      }
    },
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
      ...TAILWIND_CONFIG,
      files: 'packages/nextra-theme-docs/**/*',
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-docs/tailwind.config.js',
          callees: ['cn'],
          whitelist: ['nextra-breadcrumb', 'nextra-callout', 'nextra-bleed']
        }
      }
    },
    {
      ...TAILWIND_CONFIG,
      files: 'packages/nextra-theme-blog/**/*',
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-blog/tailwind.config.js',
          whitelist: ['subheading-', 'post-item', 'post-item-more']
        }
      }
    },
    {
      ...TAILWIND_CONFIG,
      files: 'packages/nextra/**/*',
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-docs/tailwind.config.js'
        }
      }
    },
    {
      ...TAILWIND_CONFIG,
      files: 'examples/swr-site/**/*',
      settings: {
        tailwindcss: {
          config: 'examples/swr-site/tailwind.config.js'
        }
      }
    },
    {
      ...TAILWIND_CONFIG,
      files: 'docs/**/*',
      settings: {
        tailwindcss: {
          config: 'docs/tailwind.config.js',
          callees: ['cn'],
          whitelist: ['dash-ring', 'theme-1', 'theme-2', 'theme-3', 'theme-4']
        }
      }
    },
    {
      files: [
        'prettier.config.js',
        'postcss.config.js',
        'tailwind.config.js',
        'next.config.js',
        '.eslintrc.cjs'
      ],
      env: {
        node: true
      }
    }
  ]
}
