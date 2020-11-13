# Nextra

## Development

### Installation

The Nextra repository uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces). To install dependencies, just simply run `yarn` in the project root directory.

### Build Nextra Core

```
yarn build:core
```

or

```
cd packages/nextra
yarn build
```

### Build Nextra Theme

```
yarn build:theme-docs
```

or

```
cd packages/nextra-theme-docs
yarn build
```

### Development

Once you have core and theme built, you can debug them with the corresponding example locally. For instance, to start examples/docs locally, run 

```
cd examples/docs
yarn dev
```

Any change to the example, `nextra` or `nextra-theme-docs` packages (rebuild required) will be re-rendered instantly.
