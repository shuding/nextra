/**
 * The code included in this file is inspired by https://github.com/reach/reach-ui/blob/43f450db7bcb25a743121fe31355f2294065a049/packages/skip-nav/src/reach-skip-nav.tsx which is part of the @reach/skip-nav library.
 *
 * @reach/skip-nav is licensed as follows:
 * The MIT License (MIT)
 *
 * Copyright (c) 2018-2023, React Training LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Source: https://github.com/reach/reach-ui/blob/43f450db7bcb25a743121fe31355f2294065a049/LICENSE
 */
import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { forwardRef } from 'react'

// TODO: Change the DEFAULT_ID for `nextra-skip-nav` or something else on the next major version (v3.x). The DEFAULT_ID must be 'reach-skip-nav' because changing this value is a breaking change for users that use v2.0.1 and earlier
const DEFAULT_ID = 'reach-skip-nav'
const DEFAULT_LABEL = 'Skip to content'

type SkipNavLinkProps = Omit<
  ComponentProps<'a'>,
  'ref' | 'href' | 'children'
> & {
  label?: string
  styled?: boolean
}

export const SkipNavLink = forwardRef<HTMLAnchorElement, SkipNavLinkProps>(
  (
    {
      className: providedClassName,
      id,
      label = DEFAULT_LABEL,
      styled,
      ...props
    },
    forwardedRef
  ): ReactElement => {
    const className =
      providedClassName === undefined // Give the option to the user to pass a falsy other than undefined to remove the default styles
        ? styled // Give the user a way to opt-in the default style provided with the theme. Probably remove this option in the next major version (v3.x) and just do a check to use the providedClassName or the default
          ? cn(
              '_sr-only',
              'focus:_not-sr-only focus:_fixed focus:_z-50 focus:_m-3 focus:_ml-4 focus:_h-[calc(var(--nextra-navbar-height)-1.5rem)] focus:_rounded-lg focus:_border focus:_px-3 focus:_py-2 focus:_align-middle focus:_text-sm focus:_font-bold',
              'focus:_text-gray-900 focus:dark:_text-gray-100',
              'focus:_bg-white focus:dark:_bg-neutral-900',
              'focus:_border-neutral-400 focus:dark:_border-neutral-800'
            )
          : ''
        : providedClassName

    return (
      <a
        {...props}
        ref={forwardedRef}
        href={`#${id || DEFAULT_ID}`}
        className={className}
      >
        {label}
      </a>
    )
  }
)
SkipNavLink.displayName = 'SkipNavLink'

type SkipNavContentProps = Omit<ComponentProps<'div'>, 'ref' | 'children'>

export const SkipNavContent = forwardRef<HTMLDivElement, SkipNavContentProps>(
  ({ id, ...props }, forwardedRef): ReactElement => (
    <div {...props} ref={forwardedRef} id={id || DEFAULT_ID} />
  )
)
SkipNavContent.displayName = 'SkipNavContent'
