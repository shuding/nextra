import cn from 'clsx'
import { Anchor as _Anchor } from 'nextra/mdx-components'

export const Anchor: typeof _Anchor = props => {
  return (
    <_Anchor
      {...props}
      className={cn('focus-visible:nextra-focus', props.className)}
    />
  )
}
