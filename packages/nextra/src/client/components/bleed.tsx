import cn from 'clsx'
import type { FC, HTMLAttributes } from 'react'

/**
 * A built-in component to slightly expand content beyond the container's width, `<Bleed>` allows it
 * to overflow on both sides.
 *
 * It's ideal for enhancing the presentation of graphical elements, offering a more immersive and
 * visually appealing reading experience.
 *
 * @example
 *
 * You can put text, image, video or any component inside.
 *
 * ### Text
 *
 * <Bleed className="bg-white dark:bg-neutral-800 px-16 py-10 text-center border">
 *   _There is nothing to writing. All you do is sit down at a typewriter and **bleed**._
 *
 *   — Ernest Hemingway
 * </Bleed>
 *
 * ### Video
 *
 * <Bleed>
 *   <iframe
 *     className="aspect-video w-full"
 *     src="https://youtube.com/embed/3hccXiXI0u8"
 *     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 *     allowFullScreen
 *   />
 * </Bleed>
 *
 * ### Full-bleed
 *
 * You can even make it full-bleed by using `<Bleed full>`:
 *
 * <Bleed full>![Nextra](/opengraph-image.jpeg)</Bleed>
 *
 * @usage
 *
 * ```mdx filename="MDX"
 * import { Bleed } from 'nextra/components'
 *
 * <Bleed>Hey, I can use **Markdown** syntax here.</Bleed>
 *
 * <Bleed full>![Nextra](https://nextra.site/og.jpeg)</Bleed>
 *
 * <Bleed full>
 *   <iframe
 *     src="https://codesandbox.io/embed/swr-states-4une7"
 *     width="100%"
 *     height="500px"
 *     title="SWR-States"
 *   />
 * </Bleed>
 * ```
 */
export const Bleed: FC<
  {
    /** Extend content to the very edges of its container. */
    full: boolean
  } & HTMLAttributes<HTMLDivElement>
> = ({ full, className, ...props }) => {
  return (
    <div
      className={cn(
        'nextra-bleed x:relative x:-mx-4 x:mt-[1.25em] x:md:-mx-8 x:2xl:-mx-24',
        'x:z-1', // for firefox https://github.com/shuding/nextra/issues/2824
        full && [
          // 'md:mx:[calc(-50vw+50%+8rem)',
          'x:xl:me-[calc(50%-50vw)] x:xl:ms-[calc(50%-50vw+16rem)]'
        ],
        className
      )}
      {...props}
    />
  )
}
