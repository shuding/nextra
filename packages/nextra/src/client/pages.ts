import { notFound } from 'next/navigation'
import { logger } from '../server/utils'

export async function importPage(pathSegments: string[] = [], locale = '') {
  const { RouteToFilepath } = await import(
    `private-dot-next/static/chunks/nextra-page-map-${locale}.mjs`
  )

  const pagePath = RouteToFilepath[pathSegments.join('/')]
  try {
    // logger.info('Importing page', [pagePath])
    return require(`private-next-root-dir/mdx/${pagePath}`)
  } catch (error) {
    logger.error('Error while loading', pagePath, error)
    notFound()
  }
}

export async function getPagesPaths(locale = '') {
  const { RouteToFilepath } = await import(
    `private-dot-next/static/chunks/nextra-page-map-${locale}.mjs`
  )

  return Object.keys(RouteToFilepath)
}
