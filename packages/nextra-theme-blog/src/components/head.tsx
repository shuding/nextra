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
    // eslint-disable-next-line @next/next/no-head-element -- ignore since we use app router
    <head>
      {children}
      <style>
        {`:root{--nextra-bg:${bgColor.light};}.dark{--nextra-bg:${bgColor.dark};}`}
      </style>
    </head>
  )
}
