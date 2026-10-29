import type { ReactNode } from 'react'
import { extractStringsFromReactNode } from './extract-only-strings-from-react-node'

/**
 * Returns the `aria-label` for the navbar logo link.
 * If the logo contains visible text, returns `undefined` so the link's accessible name
 * comes from that text (WCAG 2.5.3 Label in Name). Otherwise returns a fallback name.
 */
export function getLogoLinkLabel(logo: ReactNode): string | undefined {
  return extractStringsFromReactNode(logo).trim() ? undefined : 'Home page'
}
