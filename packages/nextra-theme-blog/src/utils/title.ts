import { LayoutProps } from '../types'

export const getTitle = ({ opts, config }: LayoutProps) => {
  const pageTitle = opts.meta.title || opts.titleText || ''
  const title = `${pageTitle}${config.titleSuffix || ''}`
  return {
    pageTitle,
    title
  }
}
