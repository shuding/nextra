import type { ReactNode } from 'react'
import { SWRLogo } from '../../../theme.config'

export function Separator({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <SWRLogo className="h-1.5 shrink-0" />
      {children}
    </div>
  )
}

export default {
  '--- hey': {
    title: <Separator>Getting Started</Separator>,
    type: 'separator'
  },
  'getting-started': {
    title: (
      <>
        <i>Getting</i>&nbsp;<s>Started</s>
      </>
    )
  },
  options: '',
  'global-configuration': '',
  'data-fetching': '',
  'error-handling': {
    display: 'hidden'
  },
  revalidation: 'Auto Revalidation',
  'conditional-fetching': 'Conditional Data Fetching',
  arguments: '',
  mutation: '',
  pagination: '',
  '--- my_new_separator': {
    title: <Separator>Advanced</Separator>,
    type: 'separator'
  },
  prefetching: '',
  'with-nextjs': 'Next.js SSG and SSR',
  typescript: 'TypeScript :)',
  suspense: '',
  middleware: '',
  advanced: '',
  'change-log': {
    theme: {
      sidebar: false
    }
  },
  github_link: {
    title: 'GitHub 🐙 →',
    href: 'https://github.com/shuding/nextra',
    newWindow: true
  },
  'wrap-toc-items': 'Wrap Table of Content Items',
  'custom-header-ids': 'Custom Header IDs',
  '404-500': '404/500 Custom Error Pages',
  'raw-layout': {
    theme: {
      layout: 'raw'
    }
  }
}
