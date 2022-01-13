export default {
  github: 'https://github.com/shuding/nextra',
  projectChatLink: 'https://discord.gg/hEM84NMkRv', // Next.js discord server
  docsRepositoryBase:
    'https://github.com/shuding/nextra/tree/core/examples/docs/pages',
  titleSuffix: ' – Nextra',
  logo: (
    <>
      <span className="font-extrabold">Nextra</span>
      <span className="mr-2 ml-2 text-gray-500 font-normal hidden md:inline">
        The Next Site Builder
      </span>
    </>
  ),
  head: (
    <>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="Nextra: the next site builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta property="og:title" content="Nextra: the next site builder" />
      <meta property="og:description" content="Nextra: the next site builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </>
  ),
  search: true,
  unstable_stork: false,
  unstable_faviconGlyph: '✦',
  prevLinks: true,
  nextLinks: true,
  floatTOC: true,
  footer: true,
  footerEditLink: ({ locale }) =>
    locale === 'zh' ? '前往 GitHub 编辑此页' : 'Edit this page on GitHub',
  footerText: <>MIT {new Date().getFullYear()} © Shu Ding.</>
}
