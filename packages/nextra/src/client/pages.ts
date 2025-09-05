'use no memo'

import { notFound } from 'next/navigation'
import { getRouteToFilepath } from '../server/page-map/get.js'
import { logger } from '../server/utils.js'
import type { EvaluateResult } from '../types.js'

/**
 * Function to import an MDX/Markdown page from the `content` directory.
 *
 * This function is essential for Nextra's dynamic page loading from a catch-all route.
 *
 * @returns
 * A Promise that resolves to an object containing:
 *  - `default`: The MDX component to render
 *  - `toc`: Table of contents list
 *  - `metadata`: Page's front matter or `metadata` object including `title`, `description`, etc.
 *
 * @example
 * ### Basic usage in a dynamic Next.js route
 *
 * ```ts
 * const { default: MDXContent, toc, metadata } = await importPage(['docs', 'getting-started'])
 * ```
 *
 * ### Usage with i18n
 *
 * ```ts
 * const { default: MDXContent } = await importPage(['docs', 'getting-started'], 'en')
 * ```
 *
 * ### Import page's front matter in `generateMetadata` function
 *
 * ```ts
 * // app/[[...mdxPath]]/page.tsx
 * import { importPage } from 'nextra/pages'
 *
 * export async function generateMetadata(props) {
 *   const params = await props.params
 *   const { metadata } = await importPage(params.mdxPath)
 *   return metadata
 * }
 * ```
 *
 * ### Import page in a catch-all route
 *
 * ```tsx
 * // app/[[...mdxPath]]/page.tsx
 * import { generateStaticParamsFor, importPage } from 'nextra/pages'
 * import { useMDXComponents as getMDXComponents } from 'path/to/your/mdx-components'
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
 *
 * @see
 * - [Content Directory Documentation](https://nextra.site/docs/file-conventions/content-directory)
 * - [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
 * - [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
 */
export async function importPage(
  /**
   * Array of path segments representing the route to the page.
   *
   * E.g., for the route `/docs/getting-started/installation`, pass `['docs', 'getting-started', 'installation']`.
   * @default []
   */
  pathSegments: string[] = [],
  /**
   * The language segment when using i18n.
   * @default ''
   */
  lang = ''
): Promise<EvaluateResult> {
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
 * Generates static parameters based on your `content` directory structure.
 *
 * This helper function is designed to work with Next.js' `generateStaticParams` function to create
 * static paths for all your MDX/Markdown pages.
 *
 * @returns A function that generates an array of parameters for static page generation.
 *
 * @example
 * ### Basic usage with a catch-all route
 *
 * ```ts
 * // app/[[...slug]]/page.tsx
 * export const generateStaticParams = generateStaticParamsFor('slug')
 * ```
 *
 * ### Usage with i18n support
 *
 * ```ts
 * // app/[locale]/[[...mdxPath]]/page.tsx
 * export const generateStaticParams = generateStaticParamsFor('mdxPath', 'locale')
 * ```
 *
 * @see
 * - [Next.js `generateStaticParams` function](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
 * - [Content Directory Structure](https://nextra.site/docs/file-conventions/content-directory)
 */
export function generateStaticParamsFor(
  /** The name of your catch-all route segment (e.g., `'slug'`, `'mdxPath'`). */
  segmentKey: string,
  /**
   * The name of the locale segment when you have i18n.
   * @default "lang"
   */
  localeSegmentKey = 'lang'
) {
  return async () => {
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
}
