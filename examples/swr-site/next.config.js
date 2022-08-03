const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  unstable_flexsearch: {
    codeblocks: true,
  },
  unstable_staticImage: true,
});

module.exports = withNextra({
  i18n: {
    locales: ["en-US", "es-ES", "ja", "ko", "ru", "zh-CN"],
    defaultLocale: "en-US",
  },
  redirects: () => {
    return [
      // {
      //   source: "/docs.([a-zA-Z-]+)",
      //   destination: "/docs/getting-started",
      //   statusCode: 301,
      // },
      // {
      //   source: "/advanced/performance",
      //   destination: "/docs/advanced/performance",
      //   statusCode: 301,
      // },
      // {
      //   source: "/advanced/cache",
      //   destination: "/docs/advanced/cache",
      //   statusCode: 301,
      // },
      // {
      //   source: "/docs/cache",
      //   destination: "/docs/advanced/cache",
      //   statusCode: 301,
      // },
      {
        source: "/change-log",
        destination: "/docs/change-log",
        statusCode: 301,
      },
      {
        source: "/blog/swr-1",
        destination: "/blog/swr-v1",
        statusCode: 301,
      },
      {
        source: "/docs.([a-zA-Z-]+)",
        destination: "/docs/getting-started",
        statusCode: 302,
      },
      {
        source: "/docs",
        destination: "/docs/getting-started",
        statusCode: 302,
      },
      {
        source: "/examples",
        destination: "/examples/basic",
        statusCode: 302,
      },
    ];
  },
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
      symlinks: false,
    };
    return config;
  },
  experimental: {
    newNextLinkBehavior: true,
  },
});
