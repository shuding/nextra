# Nextra

Nextra is a Next.js plugin. Besides all the features that Next.js supports, it renders your **MDX files** with specific themes.

## Development

### Installation

The Nextra repository uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces). To install dependencies, just simply run `yarn` in the project root directory.

### Build Nextra Core

```
cd packages/nextra
yarn build
```

Watch mode: `yarn dev`

### Build Nextra Theme

```
cd packages/nextra-theme-docs
yarn build
```

Watch mode: `yarn dev`
Watch mode (layout only): `yarn dev:layout`
Watch mode (style only): `yarn dev:tailwind`

### Development

You can also debug them toegther with a website locally. For instance, to start examples/docs locally, run

```
cd examples/docs
yarn dev
```

Any change to example/docs will be re-rendered instantly.

If you update the core or theme packages, a rebuild is required. Or you can use the watch mode for both nextra and the theme in separated terminals.
