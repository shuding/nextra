# Nextra

Simple, powerful and flexible site generation framework with everything you love
from Next.js.

## Documentation

https://nextra.site

## Development

### Installation

The Nextra repository uses [PNPM Workspaces](https://pnpm.io/workspaces) and
[Turborepo](https://github.com/vercel/turborepo).

1. Run `corepack enable` to enable Corepack.

   > If the command above fails, run `npm install -g corepack@latest` to install
   > the latest version of
   > [Corepack](https://github.com/nodejs/corepack?tab=readme-ov-file#manual-installs).

2. Run `pnpm install` to install the project's dependencies.

### Build `nextra`

```bash
pnpm --filter nextra build
```

Watch mode: `pnpm --filter nextra dev`

### Build `nextra-theme-docs`

```bash
pnpm --filter nextra-theme-docs build
```

### Development

You can also debug them together with a website locally. For instance, to start
`examples/docs` locally, run

```bash
pnpm --filter example-docs dev
```

Any change to `example/docs` will be re-rendered instantly.

If you update the core or theme packages, a rebuild is required. Or you can use
the watch mode for both Nextra and the theme in separated terminals.

## Sponsors

<div>
 <a href="https://xyflow.com?utm_source=github&utm_campaign=nextra&utm_content=logolink">
   <img src="/docs/app/showcase/_logos/xyflow.png" alt="xyflow preview" width="256">
 </a>
 <a href="https://speakeasyapi.dev/docs?utm_source=github&utm_campaign=nextra&utm_content=logolink">
   <img src="/docs/app/showcase/_logos/speakeasy.png" alt="Speakeasy preview" width="256">
 </a>
 <a href="https://the-guild.dev/graphql/hive?utm_source=github&utm_campaign=nextra&utm_content=logolink">
   <img src="/docs/app/showcase/_logos/graphql-hive.png" alt="GraphQL Hive preview" width="256">
 </a>
</div>
