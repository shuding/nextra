/* eslint sort-keys: error */
import type { NextraBlogTheme } from './types'

export const DEFAULT_THEME: NextraBlogTheme = {
  footer: (
    <small className="nx-mt-32 nx-block">
      CC BY-NC 4.0 {new Date().getFullYear()} © Shu Ding.
    </small>
  ),
  readMore: 'Read More →'
}
