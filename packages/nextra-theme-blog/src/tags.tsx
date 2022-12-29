import React from 'react'
import { useSSG } from 'nextra/ssg'
import Head from 'next/head'
import { getStaticTags } from './utils/get-tags'

const NEXTRA_INTERNAL = Symbol.for('__nextra_internal__')

export const TagTitle = () => {
  const { tag } = useSSG()
  return (
    <>
      <Head>
        <title>{`Posts Tagged with ${tag}`}</title>
      </Head>
    </>
  )
}

export const TagName = () => {
  const { tag } = useSSG()
  return tag || null
}

export const getStaticPaths = () => {
  const tags = getStaticTags((globalThis as any)[NEXTRA_INTERNAL].pageMap)
  return {
    paths: tags.map(v => ({ params: { tag: v } })),
    fallback: false
  }
}
export const getStaticProps = ({
  params: { tag }
}: {
  params: { tag: string }
}) => {
  return {
    props: {
      ssg: {
        tag
      }
    }
  }
}
