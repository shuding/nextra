import React from 'react'
import NextHead from 'next/head'
import { useTheme } from 'next-themes'

import renderComponent from './utils/render-component'
import { useConfig } from './config'
import { PageOpts } from 'nextra'

interface HeadProps {
  title: string
  locale: string
  meta: PageOpts['meta']
}

export default function Head({ title, locale, meta }: HeadProps) {
  const config = useConfig()
  const { theme, systemTheme } = useTheme()
  const renderedTheme = theme === 'system' ? systemTheme : theme
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <NextHead>
      <title>
        {title}
        {renderComponent(config.titleSuffix, { locale, config, title, meta })}
      </title>
      {renderComponent(config.head, { locale, config, title, meta }, true)}
      {config.unstable_faviconGlyph ? (
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.unstable_faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`}
        />
      ) : null}
      {!mounted ? (
        <>
          <meta
            name="theme-color"
            content="#ffffff"
            media="(prefers-color-scheme: light)"
          />
          <meta
            name="theme-color"
            content="#111111"
            media="(prefers-color-scheme: dark)"
          />
        </>
      ) : (
        <meta
          name="theme-color"
          content={renderedTheme === 'dark' ? '#111111' : '#ffffff'}
        />
      )}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
    </NextHead>
  )
}
