import { useRouter as useNextRouter } from 'next/router'
import { useMemo } from 'react'

export const useRouter: typeof useNextRouter = () => {
  const router = useNextRouter()

  return useMemo(() => {
    const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE
    return {
      ...router,
      defaultLocale,
      ...(defaultLocale && { locale: router.route.split('/')[1] })
    }
  }, [router])
}
