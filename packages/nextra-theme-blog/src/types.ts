interface Props {
  title: string,
  meta: Record<string, unknown>
}

export interface NextraBlogTheme {
  readMore?: string
  footer?: (props: Props) => React.ReactNode
  titleSuffix?: string
  postFooter?: string
  head?: (props: Props) => React.ReactNode
  cusdis?: {
    appId: string
    host?: string
    lang: string
  }
  darkMode?: boolean
  navs?: {
    url: string
    name: string
  }[]
}
