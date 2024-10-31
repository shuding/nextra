'use client'

import { usePathname } from 'next/navigation'
import { useConfig } from 'nextra-theme-docs'
import { useEffect } from 'react'

export const NavTester = () => {
  const { setTopLevelNavbarItems } = useConfig()
  const path = usePathname()

  useEffect(() => {
    console.log(path)
    if (path === '/docs') {
      console.log('fires')
      setTopLevelNavbarItems([
        {
          product: {
            title: 'Product',
            type: 'menu',
            items: {
              about: {
                href: '/product'
              },
              test: {
                href: '/test'
              }
            }
          }
        },
        {
          name: 'Services',
          type: 'menu',
          items: [
            {
              service1: {
                href: '/service1'
              }
            },
            {
              service2: {
                href: '/service2'
              }
            }
          ]
        }
      ])
    }
  }, [path])

  return <div>NAV-TEST</div>
}
