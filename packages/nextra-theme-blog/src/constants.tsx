/* eslint sort-keys: error */
import { ERROR_ROUTES } from 'nextra/constants'
import type { NextraBlogTheme } from './types'

export const DEFAULT_THEME: NextraBlogTheme = {
  footer: (
    <small className="nx-mt-32 nx-block">
      CC BY-NC 4.0 {new Date().getFullYear()} © Shu Ding.
    </small>
  ),
  hiddenPages: [...ERROR_ROUTES],
  readMore: 'Read More →'
}
