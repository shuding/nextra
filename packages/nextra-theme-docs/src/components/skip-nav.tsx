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

const DEFAULT_ID = 'nextra-skip-nav'
const DEFAULT_LABEL = 'Skip to Content'

export const SkipNavLink = ({
  // Give the option to the user to pass a falsy other than undefined to remove the default styles
  className,
  id = DEFAULT_ID,
  children = DEFAULT_LABEL,
  ...props
}: Omit<ComponentProps<'a'>, 'href'>): ReactElement => (
  <a
    {...props}
    href={`#${id}`}
    className={cn(
      'nextra-focus nextra-skip-nav _sr-only',
      'focus-visible:_not-sr-only focus-visible:_fixed focus-visible:_z-50 focus-visible:_my-3 focus-visible:_mx-4 focus-visible:_rounded-lg focus-visible:_px-3 focus-visible:_py-2 focus-visible:_text-sm focus-visible:_font-bold',
      'focus-visible:_bg-[rgb(var(--nextra-bg))] focus-visible:_border focus-visible:_border-current',
      className
    )}
  >
    {children}
  </a>
)

export const SkipNavContent = ({
  id = DEFAULT_ID,
  ...props
}: Omit<ComponentProps<'div'>, 'children'>): ReactElement => (
  <div {...props} id={id} />
)
