import cn from 'clsx'
import styles from './style.module.css'

export function Feature({ large, centered, children, className, ...props }) {
  return (
    <div
      className={cn(
        styles.feature,
        large && styles.large,
        centered && styles.centered,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Features({ children }) {
  return <div className={styles.features}>{children}</div>
}
