/* eslint sort-keys: error */
import type { NextraBlogTheme } from './types'

export const DEFAULT_THEME: NextraBlogTheme = {
  focusRing: false,
  footer: (
    <small className="_mt-32 _block">
      CC BY-NC 4.0 {new Date().getFullYear()} © Shu Ding.
    </small>
  ),
  readMore: 'Read More →'
}
