declare module '*.svg?svgr' {
  import type { FC, SVGProps } from 'react'
  const ReactComponent: FC<SVGProps<SVGElement>>

  export default ReactComponent
}
