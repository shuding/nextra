import Image, { type ImageProps } from 'next/image'
import { createElement } from 'react'
import Zoom from 'react-medium-image-zoom'

function getNextImageSrc(src: ImageProps['src']): string {
  if (typeof src === 'string') {
    return src
  }
  if ('default' in src) {
    return src.default.src
  }
  return src.src
}

export function ImageZoom(props: ImageProps) {
  const ComponentToUse = typeof props.src === 'string' ? 'img' : Image
  return (
    <Zoom
      zoomMargin={40}
      zoomImg={{
        src: getNextImageSrc(props.src),
        alt: props.alt
      }}
    >
      {createElement(ComponentToUse, props)}
    </Zoom>
  )
}
