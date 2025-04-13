'use no memo'

import type { FC } from 'react'
import { notFound } from 'next/navigation'
import { getRouteToFilepath } from '../server/page-map/get.js'
import { logger } from '../server/utils.js'
import type { Heading, NextraMetadata } from '../types.js'

/**
 * Helper function to import an MDX/Markdown page from `content` directory.
 *
 * @example
 * ```ts filename="Import page's front matter in generateMetadata"
 * // app/[[...mdxPath]]/page.tsx
 * import { importPage } from 'nextra/pages'
 *
 * export async function generateMetadata(props) {
 *   const params = await props.params
 *   const { metadata } = await importPage(params.mdxPath)
 *   return metadata
 * }
 * ```
 * ```ts filename="Import page in a catch-all route"
 * // app/[[...mdxPath]]/page.tsx
 * import { generateStaticParamsFor, importPage } from 'nextra/pages'
 * import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
 *
 * export const generateStaticParams = generateStaticParamsFor('mdxPath')
 *
 * const Wrapper = getMDXComponents().wrapper
 *
 * export default async function Page(props) {
 *   const params = await props.params
 *   const result = await importPage(params.mdxPath)
 *   const { default: MDXContent, toc, metadata } = result
 *   return (
 *     <Wrapper toc={toc} metadata={metadata}>
 *       <MDXContent {...props} params={params} />
 *     </Wrapper>
 *   )
 * }
 * ```
 * @see
 * - [`content` directory](https://nextra.site/docs/file-conventions/content-directory).
 * - [catch-all route](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments)
 */
export async function importPage(
  /**
   * The segments of the path to the page. E.g. `/docs/getting-started/installation`
   * would be `['docs', 'getting-started', 'installation']`.
   * @default []
   */
  pathSegments: string[] = [],
  /**
   * When using i18n, the language segment should be passed here.
   * @default ''
   */
  lang = ''
): Promise<{ default: FC, toc: Heading[], metadata: NextraMetadata }> {
  const RouteToFilepath = await getRouteToFilepath(lang)

  const pathname = pathSegments.join('/')
  // handle non-"\w" characters,`decodeURIComponent` decodes `%26` (`&`) character
  const decodedPath = decodeURIComponent(pathname)

  const pagePath = RouteToFilepath[decodedPath]
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module -- Require statement enables Fast Refresh
    return require(`private-next-content-dir/${lang && `${lang}/`}${pagePath}`)
  } catch (error) {
    logger.error('Error while loading', { pathSegments }, error)
    notFound()
  }
}

/**
 * Helper function to generate `generateStaticParams` Next.js function from your `content` directory
 * content.
 *
 * @example
 * ```ts
 * // app/[[...slug]]/page.tsx
 * import { generateStaticParamsFor } from 'nextra/pages'
 *
 * export const generateStaticParams = generateStaticParamsFor('slug')
 * ```
 * ```ts
 * // app/[locale]/[[...mdxPath]]/page.tsx
 * import { generateStaticParamsFor } from 'nextra/pages'
 *
 * export const generateStaticParams = generateStaticParamsFor('mdxPath', 'locale')
 * ```
 *
 * @see
 * - [`generateStaticParams` function](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).
 * - [`content` directory](https://nextra.site/docs/file-conventions/content-directory).
 */
export const generateStaticParamsFor =
  (
    /** Name of your catch-all segment. */
    segmentKey: string,
    /**
     * Name of the locale segment. This is only used when you have i18n.
     * @default "lang"
     */
    localeSegmentKey = 'lang'
  ) =>
  async () => {
    const locales = JSON.parse(process.env.NEXTRA_LOCALES!) as string[]
    const result = []

    for (const locale of locales) {
      const RouteToFilepath = await getRouteToFilepath(locale)
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
