import { minimatch } from 'minimatch'
import type { MdxFile } from 'nextra'
import type { NextraBlogTheme } from '../types'

export function pageType(
  page: Pick<MdxFile, 'frontMatter' | 'route'>,
  config: NextraBlogTheme
): string {
  const type = page.frontMatter?.type
  if (typeof type === 'string') return type

  for (const hiddenPage of config.hiddenPages || []) {
    if (minimatch(page.route, hiddenPage)) return 'hidden-post'
  }

  return 'post'
}
