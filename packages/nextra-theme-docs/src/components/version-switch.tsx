import React, { ReactElement, useEffect, useState } from 'react'
import { ArrowRightIcon } from 'nextra/icons'
import { useRouter } from 'next/router'
import { Select } from './select'
import { PageItem } from '../utils'

export function VersionSwitch({
  options
}: {
  options: PageItem[]
}): ReactElement {
  const router = useRouter()
  const [route, setRoute] = useState('')
  useEffect(() => {
    const newRoute =
      options.find(opt => router.route.startsWith(opt.route))?.route || ''
    setRoute(newRoute)
  }, [router.route])

  const selected = route ? options.find(opt => opt.route === route) : options[0]
  return (
    <Select
      className="nx-flex nx-gap-1 nx-items-center"
      onChange={option => {
        setRoute(option.key)
        router.push(option.key)
      }}
      selected={{
        key: route,
        name: (
          <>
            {route ? selected?.title : 'Docs'}
            <ArrowRightIcon
              className="nx-shrink-0 nx-h-3.5 nx-w-3.5"
              pathClassName="[[aria-expanded='true']>svg>&]:nx-rotate-[270deg] nx-origin-center nx-transition-transform nx-rotate-90"
            />
          </>
        )
      }}
      options={options.map(o => ({
        key: o.route,
        name: o.title
      }))}
    />
  )
}
