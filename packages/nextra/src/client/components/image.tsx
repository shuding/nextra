import type { ImageProps } from 'next/image'
import NextImage from 'next/image'
import type { FC } from 'react'
import { createElement } from 'react'

export const Image: FC<ImageProps> = props => {
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
  return createElement(
    typeof props.src === 'object' ? NextImage : 'img',
    props as ImageProps
  )
}
