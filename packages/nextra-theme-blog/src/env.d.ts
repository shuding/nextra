declare module globalThis {
  import { NextraBlogTheme } from './types'
  import { FC } from 'react'
  import { PageOpts } from 'nextra'

  var __nextra_pageContext__: {
    [route: string]: {
      Content: FC
      pageOpts: PageOpts
      themeConfig: NextraBlogTheme
    }
  }
}
