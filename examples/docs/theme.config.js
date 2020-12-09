export default {
  github: 'https://github.com/shuding/nextra',
  titleSuffix: ' – Nextra',
  logo: (
    <>
      <span className="font-extrabold hidden md:inline">Nextra</span>
      <span className="mr-2 ml-2 text-gray-600 font-normal hidden md:inline">
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
      <meta name="og:description" content="Nextra: the next site builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta name="og:title" content="Nextra: the next site builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </>
  ),
  search: true,
  prevLinks: true,
  nextLinks: true,
  footer: true,
  footerEditOnGitHubLink: true,
  footerEditOnGitHubText: ({ locale }) => (
    locale === 'zh' ? '前往 GitHub 编辑此页' : 'Edit this page on GitHub'
  ),
  footerText: <>MIT {new Date().getFullYear()} © Shu Ding.</>,
  i18n: [
    { locale: 'en', text: 'English' },
    { locale: 'zh', text: '简体中文' },
    { locale: 'ar', text: 'العربية', direction: 'rtl' }
  ]
}
