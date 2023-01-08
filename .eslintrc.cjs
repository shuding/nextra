// eslint-disable-next-line  @typescript-eslint/no-var-requires -- valid since it's commonjs
const pkgJson = require('./package.json')

const TAILWIND_CONFIG = {
  extends: ['plugin:tailwindcss/recommended'],
  rules: {
    'tailwindcss/classnames-order': 'off', // conflicts with prettier-plugin-tailwindcss
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-custom-classname': 'error'
  }
}

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['next-env.d.ts'],
  overrides: [
    {
      files: '**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@next/next/recommended'
      ],
      rules: {
        'prefer-object-has-own': 'error',
        'logical-assignment-operators': [
          'error',
          'always',
          { enforceForIfStatements: true }
        ],
        '@typescript-eslint/prefer-optional-chain': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/no-unknown-property': ['error', { ignore: ['jsx'] }],
        'react-hooks/exhaustive-deps': 'error',
        'react/self-closing-comp': 'error',
        // todo: enable
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      },
      settings: {
        react: {
          version: pkgJson.pnpm.overrides.react
        }
      }
    },
    {
      files: '**/*.{ts,tsx,cts,mts}',
      extends: [
        // TODO: fix errors
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      parserOptions: {
        project: [
          'packages/*/tsconfig.json',
          'docs/tsconfig.json',
          'tsconfig.eslint.json'
        ]
      }
    },
    {
      files: 'packages/nextra/src/**',
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
    // ⚙️ nextra-theme-docs
    {
      ...TAILWIND_CONFIG,
      files: 'packages/nextra-theme-docs/**',
      plugins: ['typescript-sort-keys'],
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-docs/tailwind.config.js',
          callees: ['cn'],
          whitelist: ['nextra-breadcrumb', 'nextra-callout', 'nextra-bleed']
        },
        next: {
          rootDir: 'packages/nextra-theme-docs'
        }
      },
      rules: {
        ...TAILWIND_CONFIG.rules,
        'no-restricted-imports': [
          'error',
          {
            name: 'next/link',
            message: 'Use local <Anchor /> instead'
          }
        ]
      }
    },
    // ⚙️ nextra-theme-blog
    {
      ...TAILWIND_CONFIG,
      files: 'packages/nextra-theme-blog/**',
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-blog/tailwind.config.js',
          whitelist: ['subheading-', 'post-item', 'post-item-more']
        },
        next: {
          rootDir: 'packages/nextra-theme-blog'
        }
      }
    },
    // ⚙️ nextra
    {
      ...TAILWIND_CONFIG,
      files: 'packages/nextra/**',
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-docs/tailwind.config.js'
        },
        next: {
          rootDir: 'packages/nextra'
        }
      }
    },
    // ⚙️ SWR-site example
    {
      ...TAILWIND_CONFIG,
      files: 'examples/swr-site/**',
      settings: {
        tailwindcss: {
          config: 'examples/swr-site/tailwind.config.js'
        },
        next: {
          rootDir: 'examples/swr-site'
        }
      }
    },
    // ⚙️ Docs
    {
      ...TAILWIND_CONFIG,
      files: 'docs/**',
      settings: {
        tailwindcss: {
          config: 'docs/tailwind.config.js',
          callees: ['cn'],
          whitelist: ['dash-ring', 'theme-1', 'theme-2', 'theme-3', 'theme-4']
        },
        next: {
          rootDir: 'docs'
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
