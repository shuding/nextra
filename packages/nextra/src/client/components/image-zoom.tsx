'use client'

import Image, { type ImageProps } from 'next/image'
import { createElement, useEffect, useRef, useState, type FC } from 'react'
import Zoom from 'react-medium-image-zoom'

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

  const ComponentToUse = typeof props.src === 'string' ? 'img' : Image
  const img = createElement(ComponentToUse, { ...props, ref: imgRef })

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
