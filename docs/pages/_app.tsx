import { ReactElement } from 'react'
import { AppProps } from 'next/app'
import 'nextra-theme-docs/style.css'
import '../style.css'

export default function Nextra({
  Component,
  pageProps
}: AppProps): ReactElement {
  // Use the layout defined at the page level, if available
  const getLayout = (Component as any).getLayout || (page => page)

  return getLayout(<Component {...pageProps} />)
}
