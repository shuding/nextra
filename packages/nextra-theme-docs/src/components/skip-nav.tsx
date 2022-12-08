import React, { forwardRef, ComponentProps, ReactElement } from 'react'
import cn from 'clsx'

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
  function (
    {
      className: providedClassName,
      id,
      label = DEFAULT_LABEL,
      styled,
      ...props
    },
    forwardedRef
  ): ReactElement {
    const className =
      providedClassName !== undefined // Give the option to the user to pass a falsy other than undefined to remove the default styles
        ? providedClassName
        : styled // Give the user a way to opt-in the default style provided with the theme. Probably remove this option in the next major version (v3.x) and just do a check to use the providedClassName or the default
        ? cn(
            'nx-sr-only',
            'focus:nx-not-sr-only focus:nx-fixed focus:nx-z-50 focus:nx-m-3 focus:nx-ml-4 focus:nx-h-[calc(var(--nextra-navbar-height)-1.5rem)] focus:nx-rounded-lg focus:nx-border focus:nx-px-3 focus:nx-py-2 focus:nx-align-middle focus:nx-text-sm focus:nx-font-bold',
            'focus:nx-text-gray-900 focus:dark:nx-text-gray-100',
            'focus:nx-bg-white focus:dark:nx-bg-neutral-900',
            'focus:nx-border-neutral-400 focus:dark:nx-border-neutral-800'
          )
        : ''

    return (
      <a
        {...props}
        ref={forwardedRef}
        href={`#${id || DEFAULT_ID}`}
        className={className}
        // TODO: Remove in version v3.x. Must keep for compability reasons
        data-reach-skip-link=""
      >
        {label}
      </a>
    )
  }
)

type SkipNavContentProps = Omit<ComponentProps<'div'>, 'ref' | 'children'>

export const SkipNavContent = forwardRef<HTMLDivElement, SkipNavContentProps>(
  function ({ id, ...props }, forwardedRef): ReactElement {
    return <div {...props} ref={forwardedRef} id={id || DEFAULT_ID} />
  }
)
