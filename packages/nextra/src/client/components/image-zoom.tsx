'use client'

import { type ImageProps } from 'next/image'
import { useEffect, useRef, useState, type FC } from 'react'
import Zoom from 'react-medium-image-zoom'
import { Image } from '../mdx-components/image.js'

function getImageSrc(src: ImageProps['src']): string {
  if (typeof src === 'string') {
    return src
  }
  if ('default' in src) {
    return src.default.src
  }
  return src.src
}

export const ImageZoom: FC<ImageProps> = props => {
  const imgRef = useRef<HTMLImageElement>(null!)
  const [isInsideAnchor, setIsInsideAnchor] = useState(false)

  useEffect(() => {
    setIsInsideAnchor(imgRef.current.closest('a') !== null)
  }, [])

  const img = <Image {...props} ref={imgRef} />

  if (isInsideAnchor) {
    // There is no need to add zoom for images inside anchor tags
    return img
  }

  return (
    <Zoom
      zoomMargin={40}
      zoomImg={{
        src: getImageSrc(props.src),
        alt: props.alt
      }}
      // fix Expected server HTML to contain a matching <div> in <p>.
      wrapElement="span"
    >
      {img}
    </Zoom>
  )
}
