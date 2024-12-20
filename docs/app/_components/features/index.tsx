import { ArrowRightIcon } from '@components/icons'
import cn from 'clsx'
import Link from 'next/link'
import type { ComponentProps, FC, ReactNode } from 'react'
import { MotionDiv } from '../framer-motion'
import styles from './style.module.css'

export const Feature: FC<
  {
    large?: boolean
    centered?: boolean
    children: ReactNode
    lightOnly?: boolean
    href?: string
    index: number
  } & ComponentProps<typeof MotionDiv>
> = ({
  large,
  centered,
  children,
  lightOnly,
  className,
  href,
  index,
  ...props
}) => {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: Math.min(0.25 + index * 0.2, 0.8) }}
      className={cn(
        styles.feature,
        large && styles.large,
        centered && styles.centered,
        lightOnly && styles['light-only'],
        className
      )}
      {...props}
    >
      {children}
      {href && (
        <Link
          className={cn('x:focus-visible:nextra-focus', styles.link)}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          <ArrowRightIcon height="24" />
        </Link>
      )}
    </MotionDiv>
  )
}

export const Features: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.features}>{children}</div>
}
