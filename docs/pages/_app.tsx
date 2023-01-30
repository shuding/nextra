import type { ReactElement } from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'

import '../style.css'

export default function Nextra({
  Component,
  pageProps
}: AppProps): ReactElement {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/Inter.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
