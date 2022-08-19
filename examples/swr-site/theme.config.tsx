import { useRouter } from "next/router";
import NextHead from "next/head";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

const Logo = ({ height }) => (
  <svg height={height} viewBox="0 0 291 69" fill="none">
    <path
      d="M0 36.53c.07 17.6 14.4 32.01 32.01 32.01a32.05 32.05 0 0032.01-32V32a13.2 13.2 0 0123.4-8.31h20.7A32.07 32.07 0 0077.2 0a32.05 32.05 0 00-32 32.01v4.52A13.2 13.2 0 0132 49.71a13.2 13.2 0 01-13.18-13.18 3.77 3.77 0 00-3.77-3.77H3.76A3.77 3.77 0 000 36.53zM122.49 68.54a32.14 32.14 0 01-30.89-23.7h20.67a13.16 13.16 0 0023.4-8.3V32A32.05 32.05 0 01167.68 0c17.43 0 31.64 14 32 31.33l.1 5.2a13.2 13.2 0 0023.4 8.31h20.7a32.07 32.07 0 01-30.91 23.7c-17.61 0-31.94-14.42-32.01-32l-.1-4.7v-.2a13.2 13.2 0 00-13.18-12.81 13.2 13.2 0 00-13.18 13.18v4.52a32.05 32.05 0 01-32.01 32.01zM247.94 23.7a13.16 13.16 0 0123.4 8.31 3.77 3.77 0 003.77 3.77h11.3a3.77 3.77 0 003.76-3.77A32.05 32.05 0 00258.16 0a32.07 32.07 0 00-30.92 23.7h20.7z"
      fill="currentColor"
    />
  </svg>
);

const Vercel = () => (
  <svg height="20" viewBox="0 0 283 64" fill="none">
    <path
      fill="currentColor"
      d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
    />
  </svg>
);

const TITLE_WITH_TRANSLATIONS = {
  "en-US": "React Hooks for Data Fetching",
  "zh-CN": "用于数据请求的 React Hooks 库",
  "es-ES": "Biblioteca React Hooks para la obtención de datos",
  ja: "データ取得のための React Hooks ライブラリ",
  ko: "데이터 가져오기를 위한 React Hooks",
  ru: "React хуки для выборки данных",
};

const EDIT_LINK_WITH_TRANSLATIONS = {
  "zh-CN": "在 GitHub 上编辑本页",
  "es-ES": "Edite esta página en GitHub",
  ja: "Github で編集する",
  ko: "Github에서 이 페이지 편집하기",
  ru: "Редактировать на GitHub",
};

const config: DocsThemeConfig = {
  github: "https://github.com/vercel/swr",
  docsRepositoryBase: "https://github.com/vercel/swr-site/blob/master/pages",
  titleSuffix() {
    const { locale } = useRouter();
    return ` – SWR (${locale})`;
  },
  search: true,
  floatTOC: true,
  darkMode: true,
  defaultMenuCollapsed: true,
  nextThemes: {
    defaultTheme: "dark",
  },
  feedbackLink: "Question? Give us feedback →",
  feedbackLabels: "feedback",
  bannerKey: "swr-2",
  banner: "SWR 2.0 is out! Read more →",
  tocExtraContent: <img src="https://placekitten.com/g/300/200" />,
  logo() {
    const { locale } = useRouter();
    return (
      <>
        <Logo height={12} />
        <span
          className="ltr:ml-2 rtl:mr-2 font-extrabold hidden md:inline select-none"
          title={"SWR: " + (TITLE_WITH_TRANSLATIONS[locale] || "")}
        >
          SWR
        </span>
      </>
    );
  },
  head() {
    const config = useConfig();
    const description =
      config.meta.description ||
      "SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.";
    const image =
      config.meta.image ||
      "https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg";
    return (
      <>
        {/* Favicons, meta */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:image" content={image} />
        <meta name="og:title" content={`${config.title} – SWR`} />
        <meta name="og:image" content={image} />
        <meta name="apple-mobile-web-app-title" content="SWR" />
      </>
    );
  },
  sidebarSubtitle: ({ title }) => (
    <div className="flex items-center gap-2">
      <Logo height={6} />
      {title}
    </div>
  ),
  footerEditLink() {
    const { locale } = useRouter();
    return EDIT_LINK_WITH_TRANSLATIONS[locale] || "Edit this page on GitHub →";
  },
  footerText() {
    const { locale } = useRouter();

    const linkProps = {
      target: "_blank",
      rel: "noopener",
      className: "inline-flex items-center font-semibold gap-2",
      href:
        {
          "zh-CN": "https://vercel.com/?utm_source=swr_zh-cn",
          "es-ES": "https://vercel.com/?utm_source=swr_es-es",
          ja: "https://vercel.com/?utm_source=swr_ja",
          ko: "https://vercel.com/?utm_source=swr_ko",
          ru: "https://vercel.com/?utm_source=swr_ru",
        }[locale] || "https://vercel.com/?utm_source=swr",
    };

    switch (locale) {
      case "zh-CN":
        return (
          <a {...linkProps}>
            由
            <Vercel />
            驱动
          </a>
        );
      case "es-ES":
        return (
          <a {...linkProps}>
            Desarrollado por
            <Vercel />
          </a>
        );
      case "ja":
        return (
          <a {...linkProps}>
            提供
            <Vercel />
          </a>
        );
      case "ko":
        return (
          <a {...linkProps}>
            Powered by
            <Vercel />
          </a>
        );
      case "ru":
        return (
          <a {...linkProps}>
            Работает на
            <Vercel />
          </a>
        );
      default:
        return (
          <a {...linkProps}>
            Powered by
            <Vercel />
          </a>
        );
    }
  },
  i18n: [
    { locale: "en-US", text: "English" },
    { locale: "es-ES", text: "Español RTL", direction: "rtl" },
    { locale: "zh-CN", text: "简体中文" },
    { locale: "ja", text: "日本語" },
    { locale: "ko", text: "한국어" },
    { locale: "ru", text: "Русский" },
  ],
  gitTimestamp: "Last updated on",
  bodyExtraContent() {
    const router = useRouter();
    return (
      router.route.startsWith("/docs") && (
        <>💪 content from `config.bodyExtraContent`</>
      )
    );
  },
};

export default config;
