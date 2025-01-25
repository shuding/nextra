import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { ArrowRightIcon, LinkIcon } from '../icons/index.js'

export const Summary: FC<ComponentProps<'summary'>> = ({
  children,
  className,
  id,
  ...props
}) => {
  return (
    <summary
      className={cn(
        'x:focus-visible:nextra-focus',
        'x:cursor-pointer x:p-1 x:transition-colors',
        'x:hover:bg-gray-100 x:dark:hover:bg-neutral-800',
        'x:select-none x:rounded',
        'x:marker:content-[""]',
        'x:px-[1.7em] x:relative',
        className
      )}
      {...props}
    >
      <ArrowRightIcon
        // ID attached to summary jumps to incorrect position in viewport
        id={id}
        height="1em"
        className={cn(
          'x:motion-reduce:transition-none x:absolute x:start-1.5 x:top-2',
          'x:rtl:rotate-180 x:[[data-expanded]>summary:first-child>&]:rotate-90 x:transition'
        )}
        strokeWidth="3"
      />
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Permalink for this section"
          className={cn(
            'x:focus-visible:nextra-focus x:absolute x:end-0 x:top-0 x:rounded x:p-2 x:h-full',
            'x:hover:bg-gray-100 x:dark:hover:bg-neutral-800',
            'x:hover:[summary:has(&)]:bg-transparent',
            className
          )}
        >
          <LinkIcon height="1em" className="x:pointer-events-none" />
        </a>
      )}
    </summary>
  )
}
