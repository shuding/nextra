import { ArrowRightIcon } from '@components/icons'
import cn from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './style.module.css'

export function Feature({
  large,
  centered,
  children,
  lightOnly,
  className,
  href,
  index,
  ...props
}) {
  return (
    <motion.div
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
      {href ? (
        <Link className={styles.link} href={href} target="_blank">
          <ArrowRightIcon width="1.5em" />
        </Link>
      ) : null}
    </motion.div>
  )
}

export function Features({ children }: { children: ReactNode }) {
  return <div className={styles.features}>{children}</div>
}
