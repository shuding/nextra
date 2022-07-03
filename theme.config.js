import { useRouter } from "next/router";

const theme = {
  github: "https://github.com/shuding/nextra",
  projectLink: "https://github.com/shuding/nextra",
  docsRepositoryBase:
    'https://github.com/shuding/nextra/tree/core/examples/docs/pages',
  titleSuffix: ' – Nextra',
  search: true,
  unstable_flexsearch: true,
  unstable_faviconGlyph: '👋',
  unstable_staticImage: true,
  floatTOC: true,
  font: false,
  projectChatLink: "https://discord.gg/hEM84NMkRv",
  feedbackLink: "Question? Give us feedback →",

  logo: function LogoActual() {
    return (
      <>
        <span className="font-extrabold">Nextra</span>
        <span className="mr-2 ml-2 text-gray-500 font-normal hidden md:inline">
          The Next Site Builder
        </span>
      </>
    );
  },
  head: function Head({ title, meta }) {
    const router = useRouter();
    return (
      <>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content="Nextra: the Next.js site builder" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://nextra.vercel.app/og.png" />
        <meta name="twitter:site:domain" content="nextra.vercel.app" />
        <meta name="twitter:url" content="https://nextra.vercel.app" />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={meta.description} />
        <meta name="og:image" content="https://nextra.vercel.app/og.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta
          property="og:url"
          content={`https://nextra.vercel.app${router.asPath}`}
        />
        <meta
          property="twitter:image"
          content={`https://nextra.vercel.app${meta.ogImage ?? "/og.png"}`}
        />
        <meta
          property="og:image"
          content={`https://nextra.vercel.app${meta.ogImage ?? "/og.png"}`}
        />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Nextra" />
      </>
    );
  },
  footer: true,
  footerEditLink: 'Edit this page on GitHub',
  footerText: <>MIT {new Date().getFullYear()} © Nextra.</>,
  nextThemes: {
    defaultTheme: "dark",
  },
};
export default theme;
