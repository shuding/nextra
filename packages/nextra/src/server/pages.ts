import { notFound } from 'next/navigation'
// @ts-expect-error
import { RouteToPage } from 'private-dot-next/static/chunks/nextra-pages-.mjs'
import { logger } from './utils.js'

export async function importPage(pathSegments: string[] = [], locale = '') {
  const pagePath = pathSegments.join('/')
  const pageImport = RouteToPage[pagePath]
  try {
    logger.info('Importing page', [pagePath])
    return await pageImport()
  } catch (error) {
    logger.error('Error while loading', pagePath, error)
    notFound()
  }
}

export async function getPagesPaths(locale = '') {
  return Object.keys(RouteToPage)
}
