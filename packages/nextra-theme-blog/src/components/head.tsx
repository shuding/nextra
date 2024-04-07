const defaultBackgroundColor = {
  dark: '17,17,17',
  light: '250,250,250'
}

export function Head({
  backgroundColor: bgColor = defaultBackgroundColor
}: {
  backgroundColor?: {
    dark: string
    light: string
  }
}) {
  return (
    // eslint-disable-next-line @next/next/no-head-element -- ignore since we use app router
    <head>
      <style>
        {`:root{--nextra-bg:${bgColor.light};}.dark{--nextra-bg:${bgColor.dark};}`}
      </style>
    </head>
  )
}
