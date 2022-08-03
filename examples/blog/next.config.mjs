import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.jsx',
  unstable_staticImage: true
})

export default withNextra({
  reactStrictMode: true,
  webpack(config) {
    // To make pnpm workspace and themes work in this monorepo, we need to
    // disable webpack's symlinks feature here. Otherwise the symlink
    // `./node_modules/nextra-theme-docs/style.css` will be resolved as
    // `../../packages/nextra-theme-docs/style.css`, which doesn't contain
    // `node_modules` in its full path and webpack can't pick the correct loader
    // for it due to:
    // https://github.com/vercel/next.js/blob/213c42f446874d29d07fa2cca6e6b11fc9c3b711/packages/next/build/webpack/config/blocks/css/index.ts#L305
    // This is not needed for normal usage, only a workaround for this
    // development repository.
    config.resolve = {
      ...config.resolve,
      symlinks: false
    }
    return config
  }
})
