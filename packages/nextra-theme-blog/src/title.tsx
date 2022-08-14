import Head from 'next/head'
import { useSSG } from './ssg-context'
import React from 'react'
import { useBlogContext } from './blog-context'

export const StaticTitle = () => {
  const { config, opts } = useBlogContext()
  const title = `${opts.title}${config.titleSuffix || ''}`
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}

export const TagTitle = () => {
  const { config, opts } = useBlogContext()
  const data = useSSG()
  const tagTitle = config.tagTitle || (() => `${opts.title}${config.titleSuffix || ''}`)
  const title = tagTitle({
    title: `${opts.title}${config.titleSuffix || ''}`,
    tag: data?.tag
  })
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}
