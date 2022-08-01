import React from 'react'
import { useConfig } from '../config'
import { renderComponent } from '../utils/render'

export function NotFoundPage() {
  const config = useConfig()
  return <p>{renderComponent(config.notFoundLink)}</p>
}
