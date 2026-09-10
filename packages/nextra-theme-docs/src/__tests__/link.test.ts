import type { ReactElement } from 'react'
import { Link } from '../mdx-components/link'

describe('Link', () => {
  it('uses primary-700 in light mode so links meet 4.5:1 on tinted surfaces', () => {
    const element = Link({
      href: '#section',
      children: 'Hello'
    }) as ReactElement<{ className: string }>
    expect(element.props.className).toContain('x:text-primary-700')
    expect(element.props.className).toContain('x:dark:text-primary-600')
  })
})
