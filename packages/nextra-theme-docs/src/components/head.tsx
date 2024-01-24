import type { ReactElement, ReactNode } from 'react'

type Color =
  | number
  | {
      dark: number
      light: number
    }

const defaultColor = {
  hue: { dark: 204, light: 212 },
  saturation: 100
}

type HeadProps = {
  children?: ReactNode
  color?: {
    hue: Color
    saturation: Color
  }
  faviconGlyph?: string
}

export function Head({
  children,
  color = defaultColor,
  faviconGlyph
}: HeadProps): ReactElement {
  const { hue, saturation } = color
  const { dark: darkHue, light: lightHue } =
    typeof hue === 'number' ? { dark: hue, light: hue } : hue
  const { dark: darkSaturation, light: lightSaturation } =
    typeof saturation === 'number'
      ? { dark: saturation, light: saturation }
      : saturation

  return (
    <head>
      {children}
      <style>{`:root{--nextra-primary-hue:${lightHue}deg;--nextra-primary-saturation:${lightSaturation}%;--nextra-navbar-height:4rem;--nextra-menu-height:3.75rem;--nextra-banner-height:2.5rem;}.dark{--nextra-primary-hue:${darkHue}deg;--nextra-primary-saturation:${darkSaturation}%;}`}</style>
      {faviconGlyph ? (
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
        />
      ) : null}
    </head>
  )
}

Head.viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#111' }
  ]
}
