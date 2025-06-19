import type { FC } from 'react'
import { z } from 'zod'
import { reactNode } from '../../server/schemas.js'
import type { HeadProps } from '../../types.generated.js'

const darkLightSchema = z.union([
  z.number(),
  z.strictObject({
    dark: z.number(),
    light: z.number()
  })
])

function convertColor(v: z.infer<typeof darkLightSchema>) {
  return typeof v === 'number' ? { dark: v, light: v } : v
}

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

function normalizeColor(value: string): string {
  if (value.startsWith('#')) {
    return hexToRgb(value)
  }
  const rgb = value.match(RGB_RE)?.groups!.rgb
  if (rgb) {
    return rgb.replaceAll(' ', '')
  }
  return value
}

const stringColorSchema = z.string().refine(str => {
  if (HEX_RE.test(str) || RGB_RE.test(str)) {
    return true
  }
  throw new Error(
    'Color format should be in HEX or RGB format. E.g. #000, #112233 or rgb(255,255,255)'
  )
})

const colorSchema = z.strictObject({
  hue: darkLightSchema
    .default({ dark: 204, light: 212 })
    .overwrite(convertColor)
    .meta({
      description: 'The hue of the primary theme color.<br/>Range: `0 - 360`'
    }),
  saturation: darkLightSchema.default(100).overwrite(convertColor).meta({
    description:
      'The saturation of the primary theme color.<br/>Range: `0 - 100`'
  }),
  lightness: darkLightSchema
    .default({ dark: 55, light: 45 })
    .overwrite(convertColor)
    .meta({
      description:
        'The lightness of the primary theme color.<br/>Range: `0 - 100`'
    })
})

const bgColorSchema = z.strictObject({
  dark: stringColorSchema
    .default('rgb(17,17,17)')
    .transform(normalizeColor)
    .meta({
      description:
        'Background color for dark theme.<br/>Format: `"rgb(RRR,GGG,BBB)" | "#RRGGBB"`'
    }),
  light: stringColorSchema
    .default('rgb(250,250,250)')
    .transform(normalizeColor)
    .meta({
      description:
        'Background color for light theme.<br/>Format: `"rgb(RRR,GGG,BBB)" | "#RRGGBB"`'
    })
})

export const HeadPropsSchema = z.strictObject({
  color: colorSchema.default(colorSchema.parse({})),
  faviconGlyph: z.string().optional().meta({
    description: 'The glyph to use as the favicon.'
  }),
  backgroundColor: bgColorSchema.default(bgColorSchema.parse({})),
  children: reactNode.optional().meta({
    description: 'Content of `<head>`.'
  })
})

/**
 * Configure the `<head>` tags, primary color, background color and favicon glyph
 * of the website.
 *
 * @usage
 * ### Static head tags
 *
 * If you have static head tags, they should be put as `children` in `Head`. For
 * example:
 *
 * ```jsx filename="app/layout.jsx" {8}
 * import { Layout } from 'my-nextra-theme'
 * import { Head } from 'nextra/components'
 *
 * export default function MyLayout({ children, ...props }) {
 *   return (
 *     <html lang="en">
 *       <Head>
 *         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 *       </Head>
 *       <body>
 *         <Layout>{children}</Layout>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 *
 * ### Dynamic tags based on page
 *
 * You can dynamically generate the head tags based on the current page's front
 * matter. For example:
 *
 * #### via Markdown front matter
 *
 * ```mdx filename="my-page/page.mdx"
 * ---
 * title: My title
 * description: My description
 * ---
 * ```
 *
 * #### via exporting `metadata` object
 *
 * ```mdx filename="my-page/page.mdx"
 * export const metadata = {
 *   title: 'My title',
 *   description: 'My description'
 * }
 * ```
 *
 * #### in [dynamic routes with catch-all segment](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments)
 *
 * ```jsx filename="app/[[...mdxPath]]/page.jsx"
 * import { importPage } from 'nextra/pages'
 *
 * export async function generateMetadata(props) {
 *   const { mdxPath } = await props.params
 *   const { metadata } = await importPage(mdxPath)
 *   return {
 *     title: metadata.title || 'Nextra',
 *     description: metadata.description || 'The next site builder'
 *   }
 * }
 * ```
 *
 * ### Theme color
 *
 * You can adjust the theme color of the website by setting primary Hue, Saturation
 * and Lightness (HSL) values for light and dark themes. Try it out for this
 * website:
 *
 * | Hue (H)                                            | Saturation (S)                                            | Lightness (L)                                             | Background Color   |
 * | -------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ------------------ |
 * | <Slider max={360} cssVar="--nextra-primary-hue" /> | <Slider max={100} cssVar="--nextra-primary-saturation" /> | <Slider max={100} cssVar="--nextra-primary-lightness"  /> | <BackgroundColor/> |
 *
 * > [!TIP]
 * >
 * > You can adjust the lightness independently for dark or light mode to increase
 * > legibility. E.g. to have a neutral primary color you can set the primary color
 * > to be white `HSL(0, 0%, 100%)` on dark theme and gray `HSL(0, 0%, 50%)` for
 * > light theme.
 * >
 * > ```jsx filename="app/layout.jsx"
 * > <Head
 * >   color={{
 * >     hue: 0,
 * >     saturation: 0,
 * >     lightness: {
 * >       light: 50,
 * >       dark: 100
 * >     }
 * >   }}
 * > />
 * > ```
 *
 * ### Favicon glyph
 *
 * This isn't supported by all browsers, but it's a nice way to customize the
 * favicon of the website simply by using an emoji or character.
 *
 * ```jsx filename="app/layout.jsx"
 * <Head faviconGlyph="✦" />
 * ```
 */
export const Head: FC<HeadProps> = ({ children, ...props }) => {
  const { data, error } = HeadPropsSchema.safeParse(props)
  if (error) {
    throw z.prettifyError(error)
  }
  // TODO: fix it
  const { color, backgroundColor, faviconGlyph } = data as any

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
