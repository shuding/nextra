import React from 'react'
import { useConfig } from '../config'
import { renderComponent } from '../utils/render'

export function ServerSideErrorPage() {
  const config = useConfig()
  return <p>{renderComponent(config.serverSideErrorLink)}</p>
}
