'use client'

import type { FC, ReactNode } from 'react'
import { Button } from '../../components/button.js'

function toggleWordWrap() {
  const htmlDataset = document.documentElement.dataset
  const hasWordWrap = 'nextraWordWrap' in htmlDataset
  if (hasWordWrap) {
    delete htmlDataset.nextraWordWrap
  } else {
    htmlDataset.nextraWordWrap = ''
  }
}

export const ToggleWordWrapButton: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <Button
      onClick={toggleWordWrap}
      className="x:md:hidden"
      title="Toggle word wrap"
      variant="outline"
    >
      {children}
    </Button>
  )
}
