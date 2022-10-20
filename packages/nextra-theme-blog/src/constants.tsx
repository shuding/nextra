/* eslint sort-keys: error */
import React from 'react'
import { NextraBlogTheme } from './types'

export const DEFAULT_THEME: NextraBlogTheme = {
  footer: (
    <small className="nx-block nx-mt-32">
      CC BY-NC 4.0 {new Date().getFullYear()} © Shu Ding.
    </small>
  ),
  readMore: 'Read More →'
}
