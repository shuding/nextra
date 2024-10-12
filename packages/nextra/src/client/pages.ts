import { notFound } from 'next/navigation'
import { logger } from '../server/utils.js'

export async function importPage(pathSegments: string[] = [], locale = '') {
  const { RouteToFilepath } = await import(
    `private-dot-next/static/chunks/nextra-page-map-${locale}.mjs`
  )

  const pagePath = RouteToFilepath[pathSegments.join('/')]
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Require statement enables Fast Refresh
    return require(
      `private-next-root-dir/mdx/${locale && `${locale}/`}${pagePath}`
    )
  } catch (error) {
    logger.error('Error while loading', { pathSegments}, error)
    notFound()
  }
}

export async function getPagesPaths(locale = '') {
  const { RouteToFilepath } = await import(
    `private-dot-next/static/chunks/nextra-page-map-${locale}.mjs`
  )

  return Object.keys(RouteToFilepath)
}
