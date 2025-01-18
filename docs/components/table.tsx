import { ImageZoom } from 'nextra/components'
import { cloneElement } from 'react'

export function MdxLayout(props) {
  return cloneElement(props.children, {
    components: {
      img: props => (
        <ImageZoom
          {...props}
          className="nextra-border rounded-xl border drop-shadow-sm"
        />
      )
    }
  })
}
