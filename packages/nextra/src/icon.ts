/*
 * This file is used in tsup patch to generate types for SVG files.
 **/
import type { FC, SVGProps } from 'react'

declare const ReactComponent: FC<SVGProps<SVGElement>>

export { ReactComponent }
