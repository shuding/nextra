import React from 'react'

interface MyComponentProps {
  children?: React.ReactNode | string
}

export function getLastStringChild
(
  element: React.ReactNode | string
): string {
  if (typeof element === 'string') {
    return element
  }

  if (React.isValidElement(element)) {
    const props = element.props as MyComponentProps
    const children = React.Children.toArray(props.children)
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i]
      const result = getLastStringChild(child)
      if (result) {
        return result
      }
    }
  }
  
  return ''
}