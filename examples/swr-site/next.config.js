const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  flexsearch: {
    codeblocks: true,
  },
  staticImage: true,
  defaultShowCopyCode: true
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
});
