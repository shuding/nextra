import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMounted } from 'nextra/hooks'
import type { FC } from 'react'

const notFoundText = {
  en: 'This page could not be found',
  ru: 'Эта страница не может быть найдена',
  es: 'Esta pagina no se pudo encontrar'
}

const NotFoundPage: FC = () => {
  const { asPath } = useRouter()
  const mounted = useMounted()
  const lang = asPath.split('/', 2)[1]
  const text = `404 - ${notFoundText[mounted ? lang : 'en']}`

  return (
    <h1 className="h-dvh flex items-center justify-center text-4xl font-bold">
      <Head>
        <title>{text}</title>
      </Head>
      {text}
    </h1>
  )
}

export default NotFoundPage
