import cn from 'clsx'
import type { FC, HTMLAttributes } from 'react'
import { ArrowRightIcon, LinkIcon } from '../icons/index.js'

export const Summary: FC<HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  id,
  ...props
}) => {
  return (
    <summary
      className={cn(
        'x:focus-visible:nextra-focus',
        'x:cursor-pointer x:transition-colors',
        'x:hover:bg-gray-100 x:dark:hover:bg-neutral-800',
        'x:select-none x:rounded',
        'x:[&::-webkit-details-marker]:hidden', // Safari
        'x:flex x:items-center',
        className
      )}
      {...props}
    >
      <ArrowRightIcon
        height="1em"
        className={cn(
          'x:motion-reduce:transition-none x:ms-2 x:me-1 x:shrink-0',
          'x:rtl:rotate-180 x:[[data-expanded]>summary:first-child>&]:rotate-90 x:transition'
        )}
        strokeWidth="3"
      />
      <h3
        // ID attached to `<summary>` jumps to incorrect position in viewport.
        // Also, it's better to put `<summary>` content inside heading, so Pagefind will have
        // sub result title of this `<summary>` content
        id={id}
        className="x:grow x:hyphens-auto x:p-1"
      >
        {children}
      </h3>
      {id && (
        <a
          href={`#${id}`}
          aria-label="Permalink for this section"
          className={cn(
            'x:self-stretch',
            'x:flex x:items-center',
            'x:focus-visible:nextra-focus x:rounded x:px-2',
            'x:hover:bg-gray-100 x:dark:hover:bg-neutral-800',
            'x:hover:[summary:has(&)]:bg-transparent'
          )}
        >
          <LinkIcon
            height="1em"
            // avoid triggering by event.target in onClick handler from `<details>`
            className="x:pointer-events-none"
          />
        </a>
      )}
    </summary>
  )
}
