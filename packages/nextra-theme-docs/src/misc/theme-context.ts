export default <PageTheme>{
  navbar: true,
  sidebar: true,
  toc: true,
  pagination: true,
  footer: true,
  layout: 'default',
  typesetting: 'default',
  breadcrumb: true
}

export type PageTheme = {
  navbar: boolean
  sidebar: boolean
  toc: boolean
  pagination: boolean
  footer: boolean
  layout: 'default' | 'full' | 'raw'
  typesetting: 'default' | 'article'
  breadcrumb: boolean
}
