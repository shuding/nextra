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

function hexToRgb(hex: string): string {
  hex = hex.slice(1)
  if (hex.length === 3) {
    hex = hex
      // eslint-disable-next-line unicorn/prefer-spread -- https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2521#issuecomment-2564033898
      .split('')
      .map(char => char + char)
      .join('')
  }
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r},${g},${b}`
}

const RGB_RE = /^rgb\((?<rgb>.*?)\)$/
const HEX_RE = /^#(?<hex>[0-9a-f]{3,6})$/i

const colorSchema = z
  .string()
  .refine(str => {
    if (HEX_RE.test(str) || RGB_RE.test(str)) {
      return true
    }
    throw new Error(
      'Color format should be in HEX or RGB format. E.g. #000, #112233 or rgb(255,255,255)'
    )
  })
  .transform(value => {
    if (value.startsWith('#')) {
      return hexToRgb(value)
    }
    const rgb = value.match(RGB_RE)?.groups!.rgb
    if (rgb) {
      return rgb.replaceAll(' ', '')
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

export const Head: FC<HeadProps> = ({ children, ...props }) => {
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
  --nextra-content-width: 90rem;
}
.dark {
  --nextra-primary-hue: ${color.hue.dark}deg;
  --nextra-primary-saturation: ${color.saturation.dark}%;
  --nextra-primary-lightness: ${color.lightness.dark}%;
  --nextra-bg: ${backgroundColor.dark};
}
::selection {
  background: hsla(var(--nextra-primary-hue),var(--nextra-primary-saturation),var(--nextra-primary-lightness),.3);
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
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content={`rgb(${backgroundColor.light})`}
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content={`rgb(${backgroundColor.dark})`}
      />
      {faviconGlyph && (
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${faviconGlyph}</text><style>svg{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}@media(prefers-color-scheme:dark){svg{fill:#fff}}</style></svg>`}
        />
      )}
    </head>
  )
}
