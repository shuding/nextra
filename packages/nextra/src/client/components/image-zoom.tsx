'use client'

import Image, { type ImageProps } from 'next/image'
import React, { type ImgHTMLAttributes } from 'react'
import Zoom from 'react-medium-image-zoom'

interface ImageZoomProps extends ImageProps {
  children?: React.ReactNode
}

function getNextImageSrc(src: ImageProps['src']): string {
  if (typeof src === 'string') {
    return src
  }
  if ('default' in src) {
    return src.default.src
  }
  return src.src
}

function ImageZoom(props: ImageZoomProps) {
  const imgNode =
    typeof props.src === 'string' ? (
      <img {...(props as ImgHTMLAttributes<HTMLImageElement>)} />
    ) : (
      <Image {...props} />
    )

  return (
    <Zoom
      zoomMargin={40}
      zoomImg={{
        src: getNextImageSrc(props.src),
        alt: props.alt
      }}
    >
      {imgNode}
    </Zoom>
  )
}

export default ImageZoom
