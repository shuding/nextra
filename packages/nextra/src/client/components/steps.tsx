import cn from 'clsx'
import type { FC, HTMLAttributes } from 'react'
import { useId } from 'react'

/**
 * A built-in component to turn a numbered list into a visual representation of
 * steps.
 *
 * @example
 * <Steps>
 *
 * ### This is the first step
 *
 * This is the first step description.
 *
 * ### This is the second step
 *
 * This is the second step description.
 *
 * ### This is the third step
 *
 * This is the third step description.
 *
 * </Steps>
 *
 * @usage
 * Wrap a set of Markdown headings (from `<h2>` to `<h6>`) with the `<Steps>`
 * component to display them as visual steps. You can choose the appropriate
 * heading level based on the content hierarchy on the page.
 *
 * ```mdx filename="MDX" {7-15}
 * import { Steps } from 'nextra/components'
 *
 * ## Getting Started
 *
 * Here is some description.
 *
 * <Steps>
 * ### Step 1
 *
 * Contents for step 1.
 *
 * ### Step 2
 *
 * Contents for step 2.
 * </Steps>
 * ```
 *
 * ### Excluding Headings from Table of Contents
 *
 * To exclude the headings from the `<Steps>` component (or any other headings)
 * to appear in the Table of Contents, replace the Markdown headings `### ...`
 * with `<h3>` HTML element wrapped in curly braces.
 *
 * ```diff filename="MDX"
 * <Steps>
 * - ### Step 1
 * + {<h3>Step 1</h3>}
 *
 * Contents for step 1.
 * </Steps>
 * ```
 */
export const Steps: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  style,
  ...props
}) => {
  const id = useId().replaceAll(':', '')
  return (
    <div
      className={cn(
        'nextra-steps x:ms-4 x:mb-12 x:border-s x:border-gray-200 x:ps-6',
        'x:dark:border-neutral-800',
        className
      )}
      style={{
        ...style,
        // @ts-expect-error -- fixme
        '--counter-id': id
      }}
      {...props}
    >
      {children}
    </div>
  )
}
