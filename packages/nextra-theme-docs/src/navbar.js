import React from 'react'
import Link from 'next/link'

import renderComponent from './utils/render-component'

import Search from './search'
import StorkSearch from './stork-search'
import GitHubIcon from './github-icon'
import ThemeSwitch from './theme-switch'
import LocaleSwitch from './locale-switch'

export default function Navbar({ config, locale, isRTL }) {
  return (
    <nav className="flex items-center bg-white z-20 fixed top-0 left-0 right-0 h-16 border-b border-gray-200 px-6 dark:bg-dark dark:border-gray-900 bg-opacity-[.97] dark:bg-opacity-100">
      <div className="hidden md:block w-full flex items-center">
        <Link href="/">
          <a className="no-underline text-current flex items-center hover:opacity-75">
            {renderComponent(config.logo, { locale })}
          </a>
        </Link>
      </div>

      {config.customSearch ||
        (config.search ? (
          config.unstable_stork ? (
            <StorkSearch />
          ) : (
            <Search directories={flatDirectories} />
          )
        ) : null)}

      <div className="mr-2" />

      {config.darkMode ? <ThemeSwitch /> : null}

      {config.i18n ? (
        <LocaleSwitch options={config.i18n} isRTL={isRTL} />
      ) : null}

      {config.github ? (
        <a className="text-current p-2" href={config.github} target="_blank">
          <GitHubIcon height={24} />
        </a>
      ) : null}

      <button className="block md:hidden p-2" onClick={() => setMenu(!menu)}>
        <svg
          fill="none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="-mr-2" />
    </nav>
  )
}
