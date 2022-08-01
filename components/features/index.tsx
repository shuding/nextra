import cn from 'clsx'
import styles from './style.module.css'

export function Feature({
  large,
  centered,
  children,
  lightOnly,
  className,
  ...props
}) {
  return (
    <div
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
    </div>
  )
}

export function Features({ children }) {
  return <div className={styles.features}>{children}</div>
}
