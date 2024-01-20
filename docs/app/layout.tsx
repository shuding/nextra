import type { ReactNode } from 'react'
import 'nextra-theme-docs/style.css'
import '../style.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
