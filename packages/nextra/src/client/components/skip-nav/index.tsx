import type { ComponentProps, FC } from 'react'

const DEFAULT_ID = 'nextra-skip-nav'

export { SkipNavLink } from './index.client.js'

export const SkipNavContent: FC<Pick<ComponentProps<'div'>, 'id'>> = ({
  id = DEFAULT_ID
}) => {
  return <div id={id} />
}
