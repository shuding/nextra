import type { GetStaticPaths, GetStaticProps } from 'next'
import { useSSG } from 'nextra/ssg'
import Head from 'next/head'
import { getStaticTags } from './utils/get-tags'

const NEXTRA_INTERNAL = Symbol.for('__nextra_internal__')

export const TagTitle = ({ prefix = 'Posts tagged with ' }) => {
  const { tag } = useSSG()
  const title = `${prefix}${tag}`
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}

export const TagName = () => {
  const { tag } = useSSG()
  return tag || null
}

export const getStaticPaths: GetStaticPaths = () => {
  const tags = getStaticTags((globalThis as any)[NEXTRA_INTERNAL].pageMap)
  return {
    paths: tags.map(v => ({ params: { tag: v } })),
    fallback: false
  }
}
export const getStaticProps: GetStaticProps = ({ params }) => {
  return {
    props: {
      ssg: {
        tag: params?.tag
      }
    }
  }
}
