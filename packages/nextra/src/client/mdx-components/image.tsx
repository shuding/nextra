import type { ImageProps } from 'next/image'
import NextImage from 'next/image'
import { forwardRef } from 'react'

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    typeof props.src === 'object' &&
    !('blurDataURL' in props.src)
  ) {
    console.warn(
      `[nextra] Failed to load blur image "${(props.src as any).src}" due missing "src.blurDataURL" value.
This is Turbopack bug, which will not occurs on production (since Webpack is used for "next build" command).`
    )
    props = {
      ...props,
      placeholder: 'empty'
    }
  }
  const ComponentToUse = typeof props.src === 'object' ? NextImage : 'img'
  return (
    // @ts-expect-error -- fixme
    <ComponentToUse
      {...props}
      ref={ref}
      data-pagefind-index-attrs="title,alt"
    />
  )
})

Image.displayName = 'Image'
