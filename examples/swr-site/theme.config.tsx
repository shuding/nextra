/* eslint sort-keys: error */
import { useRouter } from "next/router";
import { ComponentProps, ReactElement } from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

const Logo = (props: ComponentProps<"svg">): ReactElement => (
  <svg viewBox="0 0 291 69" fill="none" {...props}>
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

const TITLE = {
  "en-US": "React Hooks for Data Fetching",
  "es-ES": "Biblioteca React Hooks para la obtención de datos",
  ja: "データ取得のための React Hooks ライブラリ",
  ko: "데이터 가져오기를 위한 React Hooks",
  ru: "React хуки для выборки данных",
  "zh-CN": "用于数据请求的 React Hooks 库",
};

const EDIT_TEXT = {
  "en-US": "Edit this page on GitHub →",
  "es-ES": "Edite esta página en GitHub",
  ja: "Github で編集する",
  ko: "Github에서 이 페이지 편집하기",
  ru: "Редактировать на GitHub",
  "zh-CN": "在 GitHub 上编辑本页",
};

const FOOTER_LINK = {
  "en-US": "https://vercel.com/?utm_source=swr",
  "es-ES": "https://vercel.com/?utm_source=swr_es-es",
  ja: "https://vercel.com/?utm_source=swr_ja",
  ko: "https://vercel.com/?utm_source=swr_ko",
  ru: "https://vercel.com/?utm_source=swr_ru",
  "zh-CN": "https://vercel.com/?utm_source=swr_zh-cn",
};

const FOOTER_LINK_TEXT = {
  "en-US": (
    <>
      Powered by
      <Vercel />
    </>
  ),
  "es-ES": (
    <>
      Desarrollado por
      <Vercel />
    </>
  ),
  ja: (
    <>
      提供
      <Vercel />
    </>
  ),
  ko: (
    <>
      Powered by
      <Vercel />
    </>
  ),
  ru: (
    <>
      Работает на
      <Vercel />
    </>
  ),
  "zh-CN": (
    <>
      由
      <Vercel />
      驱动
    </>
  ),
};

const config: DocsThemeConfig = {
  banner: {
    key: "swr-2",
    text: "SWR 2.0 is out! Read more →",
  },
  darkMode: true,
  docsRepositoryBase:
    "https://github.com/shuding/nextra/blob/core/examples/swr-site",
  editLink: {
    text() {
      const { locale } = useRouter();
      return EDIT_TEXT[locale];
    },
  },
  feedback: {
    content: "Question? Give us feedback →",
    labels: "feedback",
  },
  footer: {
    text() {
      const { locale } = useRouter();
      return (
        <a
          rel="noopener"
          target="_blank"
          className="flex items-center gap-2 font-semibold"
          href={FOOTER_LINK[locale]}
        >
          {FOOTER_LINK_TEXT[locale]}
        </a>
      );
    },
  },
  gitTimestamp: ({ timestamp }) => <>Last updated on {timestamp.toString()}</>,
  head() {
    const config = useConfig();
    const description =
      config.frontMatter.description ||
      "SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.";
    const image =
      config.frontMatter.image ||
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
  i18n: [
    { locale: "en-US", text: "English" },
    { direction: "rtl", locale: "es-ES", text: "Español RTL" },
    { locale: "zh-CN", text: "简体中文" },
    { locale: "ja", text: "日本語" },
    { locale: "ko", text: "한국어" },
    { locale: "ru", text: "Русский" },
  ],
  logo() {
    const { locale } = useRouter();
    return (
      <>
        <Logo className="h-3" />
        <span
          className="hidden select-none font-extrabold ltr:ml-2 rtl:mr-2 md:inline"
          title={"SWR: " + (TITLE[locale] || "")}
        >
          SWR
        </span>
      </>
    );
  },
  nextThemes: {
    defaultTheme: "dark",
  },
  project: {
    link: "https://github.com/vercel/swr",
  },
  sidebar: {
    titleComponent: ({ title, type }) =>
      type === "separator" ? (
        <div className="flex items-center gap-2">
          <Logo className="h-1.5 shrink-0" />
          {title}
        </div>
      ) : (
        <>{title}</>
      ),
  },
  toc: {
    extraContent: (
      <img alt="placeholder cat" src="https://placekitten.com/g/300/200" />
    ),
    float: true,
  },
  useNextSeoProps() {
    const { locale } = useRouter();
    return {
      titleTemplate: `%s | SWR (${locale})`,
    };
  },
};

export default config;
