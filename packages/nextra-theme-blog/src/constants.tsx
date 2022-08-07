import React from 'react'
import { NextraBlogTheme } from './types'

export const DEFAULT_THEME: NextraBlogTheme = {
  readMore: 'Read More →',
  footer: (
    <small className="block mt-32">
      CC BY-NC 4.0 {new Date().getFullYear()} © Shu Ding.
    </small>
  )
}
