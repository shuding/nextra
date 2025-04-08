import React from 'react'

const getLastStringChild = (element: React.ReactNode): string | null => {
  if (typeof element === 'string') {
    return element;
  }

  if (React.isValidElement(element) && element.props.children) {
    const children = React.Children.toArray(element.props.children);
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      const result = getLastStringChild(child);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export default getLastStringChild;