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
    // Rules for all files
    {
      files: '**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier'
      ],
      plugins: ['import', 'unicorn'],
      rules: {
        'prefer-object-has-own': 'error',
        'logical-assignment-operators': [
          'error',
          'always',
          { enforceForIfStatements: true }
        ],
        'no-else-return': ['error', { allowElseIf: false }],
        'no-lonely-if': 'error',
        'prefer-destructuring': [
          'error',
          { VariableDeclarator: { object: true } }
        ],
        'import/no-duplicates': 'error',
        'no-negated-condition': 'off',
        'unicorn/no-negated-condition': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'object-shorthand': ['error', 'always'],
        'unicorn/prefer-regexp-test': 'error',
        'unicorn/no-array-for-each': 'error',
        'unicorn/prefer-string-replace-all': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        // todo: enable
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    },
    // Rules for React files
    {
      files: '{packages,examples,docs}/**',
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:@next/next/recommended'
      ],
      rules: {
        'react/prop-types': 'off',
        'react/no-unknown-property': ['error', { ignore: ['jsx'] }],
        'react-hooks/exhaustive-deps': 'error',
        'react/self-closing-comp': 'error',
        'no-restricted-syntax': [
          'error',
          {
            // ❌ useMemo(…, [])
            selector:
              'CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]',
            message:
              "`useMemo` with an empty dependency array can't provide a stable reference, use `useRef` instead."
          },
          {
            // ❌ z.object(…)
            selector:
              'MemberExpression[object.name=z] > .property[name=object]',
            message: 'Use z.strictObject is more safe.'
          }
        ],
        'react/jsx-filename-extension': [
          'error',
          { extensions: ['.tsx', '.jsx'], allow: 'as-needed' }
        ],
        'react/jsx-curly-brace-presence': 'error',
        'react/jsx-boolean-value': 'error'
      },
      settings: {
        react: { version: 'detect' }
      }
    },
    // Rules for TypeScript files
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
      },
      rules: {
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error'
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
          whitelist: [
            'nextra-breadcrumb',
            'nextra-bleed',
            'nextra-menu-desktop',
            'nextra-menu-mobile'
          ]
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
        }
      }
    },
    // ⚙️ nextra
    {
      ...TAILWIND_CONFIG,
      files: 'packages/nextra/**',
      settings: {
        tailwindcss: {
          config: 'packages/nextra-theme-docs/tailwind.config.js',
          callees: ['cn'],
          whitelist: ['nextra-code-block', 'nextra-filetree']
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
        next: { rootDir: 'docs' }
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
        next: { rootDir: 'examples/swr-site' }
      }
    },
    // ⚙️ blog example
    {
      files: 'examples/blog/**',
      settings: {
        next: { rootDir: 'examples/blog' }
      }
    },
    // ⚙️ docs example
    {
      files: 'examples/docs/**',
      settings: {
        next: { rootDir: 'examples/docs' }
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
    },
    {
      files: 'packages/{nextra,nextra-theme-docs,nextra-theme-blog}/**',
      rules: {
        // disable rule because we don't have pagesDir in above folders
        '@next/next/no-html-link-for-pages': 'off'
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
    {
      files: ['**/*.d.ts'],
      rules: {
        'no-var': 'off'
      }
    }
  ]
}
