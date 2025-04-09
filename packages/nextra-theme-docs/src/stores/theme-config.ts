'use client'

import type { ComponentProps } from 'react'
import { createContext, createElement, useContext } from 'react'
import type { ThemeConfigProps } from '../layout'

const ThemeConfigContext = createContext<
  Omit<
    ThemeConfigProps,
    | 'footer'
    //
    | 'navbar'
    | 'pageMap'
    | 'nextThemes'
    | 'banner'
    | 'children'
  >
>(null!)

/**
 * Accesses the current [theme configuration](https://nextra.site/docs/docs-theme/theme-configuration)
 * values, excluding layout-specific elements like:
 * - `footer`
 * - `navbar`
 * - `pageMap`
 * - `nextThemes`
 * - `banner`
 * - `children`
 *
 * This hook is useful for dynamically configuring your project based on shared theme values.
 *
 * @returns A subset of your theme configuration context.
 */
export const useThemeConfig = () => useContext(ThemeConfigContext)

export const ThemeConfigProvider = (
  props: ComponentProps<typeof ThemeConfigContext.Provider>
) => createElement(ThemeConfigContext.Provider, props)
