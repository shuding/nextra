import React from 'react'
import { useSSG } from 'nextra/ssg'
import Head from 'next/head'
import { getStaticTags } from './utils/get-tags'
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
  // @ts-ignore
  const tags = getStaticTags(globalThis.__nextra_internal__.pageMap)
  return {
    paths: tags.map(v => ({ params: { tag: v } })),
    fallback: false
  }
}
export const getStaticProps = ({ params: { tag } }: { params: { tag: string } }) => {
  return {
    props: {
      ssg: {
        tag
      }
    }
  }
}