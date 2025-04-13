'use no memo'

import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { getRouteToFilepath } from '../server/page-map/get.js'
import { logger } from '../server/utils.js'
import type { Heading, NextraMetadata } from '../types.js'

/**
 * Function to import an MDX/Markdown page from the `content` directory and returns
 * - its React component page
 * - front matter (`metadata`)
 * - table of contents (`toc`).
 *
 * This function is essential for Nextra's dynamic page loading from a catch-all route.
 *
 * @returns A Promise that resolves to an object containing:
 *   - `default`: The MDX component to render
 *   - `toc`: Table of contents list
 *   - `metadata`: Page front matter including title, description, etc.
 *
 * @example
 * ```tsx
 * // Basic usage in a page component
 * const { default: MDXContent, toc, metadata } = await importPage(['docs', 'getting-started'])
 * ```
 * ```tsx
 * // Usage with i18n
 * const { default: MDXContent } = await importPage(['docs', 'api'], 'en')
 * ```
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
 * @throws {Error} When the page cannot be found or loaded.
 *
 * @see
 * - [Content Directory Documentation](https://nextra.site/docs/file-conventions/content-directory)
 * - [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
 */
export async function importPage(
  /**
   * Array of path segments representing the route to the page.
   * E.g., for the route `/docs/getting-started/installation`, pass `['docs', 'getting-started', 'installation']`.
   * @default []
   */
  pathSegments: string[] = [],
  /**
   * The language segment when using i18n.
   * @default ''
   */
  lang = ''
): Promise<{ default: FC; toc: Heading[]; metadata: NextraMetadata }> {
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
 * This helper function is designed to work with Next.js' `generateStaticParams` to create
 * static paths for all your MDX/Markdown pages.
 *
 * @returns A function that generates an array of parameters for static page generation.
 *
 * @example
 * ```tsx
 * // Basic usage with a catch-all route (app/[[...slug]]/page.tsx)
 * export const generateStaticParams = generateStaticParamsFor('slug')
 * ```
 * ```tsx
 * // Usage with i18n support (app/[locale]/[[...mdxPath]]/page.tsx)
 * export const generateStaticParams = generateStaticParamsFor('mdxPath', 'locale')
 * ```
 *
 * @see
 * - [Next.js `generateStaticParams` function](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
 * - [Content Directory Structure](https://nextra.site/docs/file-conventions/content-directory)
 */
export const generateStaticParamsFor =
  (
    /** The name of your catch-all route segment (e.g., `'slug'`, `'mdxPath'`). */
    segmentKey: string,
    /**
     * The name of the locale segment when you have i18n.
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
