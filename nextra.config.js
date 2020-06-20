export default {
  github: 'https://github.com/shuding/nextra',
  titleSuffix: ' – Nextra',
  logo: <>
    <span className="mr-2 font-extrabold hidden md:inline">Nextra</span>
    <span className="text-gray-600 font-normal hidden md:inline">The Next Docs Builder</span>
  </>,
  head: () => <>
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="theme-color" content="#ffffff" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta httpEquiv="Content-Language" content="en" />
    <meta
      name="description"
      content="Nextra: the next docs builder"
    />
    <meta
      name="og:description"
      content="Nextra: the next docs builder"
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@shuding_" />
    <meta
      name="og:title"
      content="Nextra: the next docs builder"
    />
    <meta name="apple-mobile-web-app-title" content="Nextra" />
  </>,
  footer: ({ filepath }) => <>
    <hr/>
    <div className="mt-24 flex justify-end flex-col-reverse md:flex-row items-center md:items-end">
      <div className="mt-6"/>
      <a className="text-sm" href={
        'https://github.com/shuding/nextra/tree/master/pages' + filepath
      } target="_blank">Edit this page on GitHub</a>
    </div>
  </>
}
