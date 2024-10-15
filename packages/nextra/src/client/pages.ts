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
      `private-next-root-dir/content/${locale && `${locale}/`}${pagePath}`
    )
  } catch (error) {
    logger.error('Error while loading', { pathSegments }, error)
    notFound()
  }
}

export const generateStaticParamsFor =
  (segmentKey: string, localeSegmentKey = 'lang') =>
  async () => {
    const envLocales = process.env.NEXTRA_LOCALES
    const locales = envLocales ? (JSON.parse(envLocales) as string[]) : ['']
    const result = []

    for (const locale of locales) {
      const { RouteToFilepath } = await import(
        `private-dot-next/static/chunks/nextra-page-map-${locale}.mjs`
      )
      const routes = Object.keys(RouteToFilepath)

      result.push(
        ...routes.map(route => ({
          ...(locale && { [localeSegmentKey]: locale }),
          [segmentKey]: route.split('/')
        }))
      )
    }
    return result
  }
