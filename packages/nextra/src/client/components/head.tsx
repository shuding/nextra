import type { ReactElement, ReactNode } from 'react'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

const darkLightSchema = z
  .union([
    z.number(),
    z.strictObject({
      dark: z.number(),
      light: z.number()
    })
  ])
  .transform(v => (typeof v === 'number' ? { dark: v, light: v } : v))

function hexToRgb(hex: `#${string}`): string {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r},${g},${b}`
}

const colorSchema = z
  .union([
    z.string().startsWith('#'),
    z.string().startsWith('rgb('),
    z.string().regex(/^\d{1,3},\d{1,3},\d{1,3}$/)
  ])
  .transform(value => {
    if (value.startsWith('#')) {
      return hexToRgb(value as `#${string}`)
    }
    const groups = value.match(/^rgb\((?<rgb>.*?)\)$/)?.groups
    if (groups) {
      return groups.rgb.replaceAll(' ', '')
    }
    return value
  })

const headSchema = z.strictObject({
  color: z
    .strictObject({
      hue: darkLightSchema.default({ dark: 204, light: 212 }),
      saturation: darkLightSchema.default(100)
    })
    .default({}),
  faviconGlyph: z.string().optional(),
  backgroundColor: z
    .strictObject({
      dark: colorSchema.default('rgb(17,17,17)'),
      light: colorSchema.default('rgb(250,250,250)')
    })
    .default({})
})

type HeadProps = Partial<z.infer<typeof headSchema>> & {
  children?: ReactNode
}

export function Head({ children, ...props }: HeadProps): ReactElement {
  const { data, error } = headSchema.safeParse(props)
  if (error) {
    throw fromZodError(error)
  }

  const { color, backgroundColor, faviconGlyph } = data

  return (
    <head>
      {children}
      <style>{`:root{--nextra-primary-hue:${color.hue.light}deg;--nextra-primary-saturation:${color.saturation.light}%;--nextra-bg:${backgroundColor.light};}.dark{--nextra-primary-hue:${color.hue.dark}deg;--nextra-primary-saturation:${color.saturation.dark}%;--nextra-bg:${backgroundColor.dark};}`}</style>
      {faviconGlyph && (
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
        />
      )}
    </head>
  )
}

Head.viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#111' }
  ]
}
