import React, {
  Children,
  cloneElement,
  ComponentProps,
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { Summary } from './summary'
import { Collapse } from './collapse'

export const DetailsContext = createContext<Dispatch<SetStateAction<boolean>>>(
  v => v
)

const findSummary = (children: ReactNode) => {
  let summary: ReactNode = null
  const restChildren: ReactNode[] = []

  Children.forEach(children, (child, index) => {
    if (child && (child as ReactElement).type === Summary) {
      summary ||= child
      return
    }

    let c = child
    if (
      !summary &&
      child &&
      typeof child === 'object' &&
      (child as ReactElement).type !== Details &&
      'props' in child &&
      child.props
    ) {
      const result = findSummary(child.props.children)
      summary = result[0]
      c = cloneElement(child, {
        ...child.props,
        children: result[1]?.length ? result[1] : undefined,
        key: index
      })
    }
    restChildren.push(c)
  })

  return [summary, restChildren]
}

export const Details = ({
  children,
  className = '',
  open = false,
  variant = 'default',
  ...props
}: ComponentProps<'details'> & {
  variant?: 'default' | 'raw'
}): ReactElement => {
  const [openState, setOpen] = useState(open)
  const [summary, restChildren] = findSummary(children)

  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(openState)
  useEffect(() => {
    if (!openState) {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500)
      return () => {
        clearTimeout(timeout)
      }
    }
    setDelayedOpenState(true)
  }, [openState])

  return (
    <details
      className={[
        variant === 'default'
          ? 'my-4 rounded border border-gray-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 first:mt-0 last:mb-0'
          : '',
        className
      ].join(' ')}
      {...props}
      open={delayedOpenState}
    >
      <DetailsContext.Provider value={setOpen}>
        {summary}
      </DetailsContext.Provider>
      <Collapse open={openState}>{restChildren}</Collapse>
    </details>
  )
}
