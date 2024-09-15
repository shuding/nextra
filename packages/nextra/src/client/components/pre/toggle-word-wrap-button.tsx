'use client'

import type { ReactElement, ReactNode } from 'react'
import { Button } from '../button.js'

function toggleWordWrap() {
  const htmlDataset = document.documentElement.dataset
  const hasWordWrap = 'nextraWordWrap' in htmlDataset
  if (hasWordWrap) {
    delete htmlDataset.nextraWordWrap
  } else {
    htmlDataset.nextraWordWrap = ''
  }
}

export function ToggleWordWrapButton({
  children
}: {
  children: ReactNode
}): ReactElement {
  return (
    <Button
      onClick={toggleWordWrap}
      className="md:_hidden"
      title="Toggle word wrap"
      variant="outline"
    >
      {children}
    </Button>
  )
}
