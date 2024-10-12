import Document, { Head, Html, Main, NextScript } from 'next/document'
import { SkipNavLink } from 'nextra-theme-docs'

class MyDocument extends Document {
  render() {
    const pathname = this.props.__NEXT_DATA__.page
    let lang = pathname.split('/', 2)[1]

    if (!['en', 'es', 'ru'].includes(lang)) {
      lang = 'en'
    }
    return (
      <Html lang={lang}>
        <Head />
        <body>
          <SkipNavLink styled />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
