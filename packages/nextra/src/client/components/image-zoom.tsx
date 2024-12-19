import Image, { type ImageProps } from 'next/image'
import { createElement, type FC } from 'react'
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
  const ComponentToUse = typeof props.src === 'string' ? 'img' : Image
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
      {createElement(ComponentToUse, props)}
    </Zoom>
  )
}
