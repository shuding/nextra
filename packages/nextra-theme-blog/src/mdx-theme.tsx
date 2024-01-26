'use client'

import type { MDXComponents } from 'nextra/mdx'
import type { ReactElement, ReactNode, RefObject } from 'react'
import {
  createContext,
  createRef,
  useContext,
  useEffect,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import { useBlogContext } from './blog-context'

export const HeadingContext = createContext<
  RefObject<HTMLHeadingElement | null>
>(createRef())

const H1 = ({ children }: { children?: ReactNode }): ReactElement => {
  const ref = useContext(HeadingContext)
  const { opts } = useBlogContext()
  const [showHeading, setShowHeading] = useState(false)
  useEffect(() => {
    if (ref.current && opts.hasJsxInH1) {
      setShowHeading(true)
    }
  }, [opts.hasJsxInH1, ref])
  return <>{showHeading && createPortal(children, ref.current!)}</>
}

export const components: MDXComponents = {
  h1: H1
}
