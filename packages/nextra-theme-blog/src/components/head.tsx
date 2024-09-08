import type { ReactNode } from 'react'

const defaultBackgroundColor = {
  dark: '17,17,17',
  light: '250,250,250'
}

type HeadProps = {
  backgroundColor?: {
    dark: string
    light: string
  }
  children?: ReactNode
}

export function Head({
  backgroundColor: bgColor = defaultBackgroundColor,
  children
}: HeadProps) {
  return (
    <head>
      {children}
      <style>
        {`:root{--nextra-banner-height:2.5rem;--nextra-bg:${bgColor.light};}.dark{--nextra-bg:${bgColor.dark};}`}
      </style>
    </head>
  )
}
