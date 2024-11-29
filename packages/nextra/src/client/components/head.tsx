import type { FC, ReactNode } from 'react'
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
  const bigint = Number.parseInt(hex.slice(1), 16)
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
      saturation: darkLightSchema.default(100),
      lightness: darkLightSchema.default({ dark: 55, light: 45 })
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

type HeadProps = Partial<z.input<typeof headSchema>> & {
  children?: ReactNode
}

const Head_: FC<HeadProps> = ({ children, ...props }) => {
  const { data, error } = headSchema.safeParse(props)
  if (error) {
    throw fromZodError(error)
  }

  const { color, backgroundColor, faviconGlyph } = data

  const style = `
:root {
  --nextra-primary-hue: ${color.hue.light}deg;
  --nextra-primary-saturation: ${color.saturation.light}%;
  --nextra-primary-lightness: ${color.lightness.light}%;
  --nextra-bg: ${backgroundColor.light};
}
.dark {
  --nextra-primary-hue: ${color.hue.dark}deg;
  --nextra-primary-saturation: ${color.saturation.dark}%;
  --nextra-primary-lightness: ${color.lightness.dark}%;
  --nextra-bg: ${backgroundColor.dark};
}
::selection {
  background: ${makePrimaryColor('+ 41%')};
}
.dark ::selection {
  background: ${makePrimaryColor('- 11%')};
}
html {
  background: rgb(var(--nextra-bg));
}
`.trim()

  return (
    // eslint-disable-next-line @next/next/no-head-element -- false positive, we use it in App router
    <head>
      {children}
      <style>{style}</style>
      {faviconGlyph && (
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
        />
      )}
    </head>
  )
}

function makePrimaryColor(val: string): string {
  const h = 'var(--nextra-primary-hue)'
  const s = 'var(--nextra-primary-saturation)'
  const l = `calc(var(--nextra-primary-lightness) ${val})`
  return `hsl(${h + s + l})`
}

export const Head = Object.assign(Head_, {
  viewport: {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#fff' },
      { media: '(prefers-color-scheme: dark)', color: '#111' }
    ]
  }
})
