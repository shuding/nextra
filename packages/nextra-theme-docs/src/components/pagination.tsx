import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { ArrowRightIcon } from 'nextra/icons'
import type { Item } from 'nextra/normalize-pages'
import type { ReactElement } from 'react'
import { useThemeConfig } from '../contexts'
import type { ThemeConfigProps } from '../layout'

interface NavLinkProps {
  currentIndex: number
  flatDocsDirectories: Item[]
}

const classes = {
  link: cn(
    '_text-gray-600 dark:_text-gray-400',
    'hover:_text-gray-800 dark:hover:_text-gray-200',
    'contrast-more:_text-gray-700 contrast-more:dark:_text-gray-100',
    '_flex _max-w-[50%] _items-center _gap-1 _py-4 _text-base _font-medium _transition-colors [word-break:break-word] md:_text-lg'
  ),
  icon: cn('_inline _h-5 _shrink-0')
}

export function Pagination({
  flatDocsDirectories,
  currentIndex
}: NavLinkProps): ReactElement | null {
  const themeConfig = useThemeConfig()
  const nav = themeConfig.navigation
  const navigation: Exclude<ThemeConfigProps['navigation'], boolean> =
    typeof nav === 'boolean' ? { prev: nav, next: nav } : nav
  let prev = navigation.prev && flatDocsDirectories[currentIndex - 1]
  let next = navigation.next && flatDocsDirectories[currentIndex + 1]

  if (prev && !prev.isUnderCurrentDocsTree) prev = false
  if (next && !next.isUnderCurrentDocsTree) next = false

  if (!prev && !next) return null

  return (
    <div
      className={cn(
        '_mb-8 _flex _items-center _border-t _pt-8 dark:_border-neutral-800',
        'contrast-more:_border-neutral-400 dark:contrast-more:_border-neutral-400',
        'print:_hidden'
      )}
    >
      {prev && (
        <NextLink
          href={prev.route}
          title={prev.title}
          className={cn(classes.link, '_pe-4')}
        >
          <ArrowRightIcon className={cn(classes.icon, 'ltr:_rotate-180')} />
          {prev.title}
        </NextLink>
      )}
      {next && (
        <NextLink
          href={next.route}
          title={next.title}
          className={cn(
            classes.link,
            '_ps-4 _ms-auto ltr:_text-right rtl:_text-left'
          )}
        >
          {next.title}
          <ArrowRightIcon className={cn(classes.icon, 'rtl:_rotate-180')} />
        </NextLink>
      )}
    </div>
  )
}
