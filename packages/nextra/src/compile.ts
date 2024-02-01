import { createRequire } from 'node:module'
import path from 'node:path'
import type { ProcessorOptions } from '@mdx-js/mdx'
import { createProcessor } from '@mdx-js/mdx'
import type { Processor } from '@mdx-js/mdx/lib/core'
import { remarkMermaid } from '@theguild/remark-mermaid'
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import grayMatter from 'gray-matter'
import rehypeKatex from 'rehype-katex'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkReadingTime from 'remark-reading-time'
import type { Pluggable } from 'unified'
import {
  CODE_BLOCK_FILENAME_REGEX,
  CWD,
  DEFAULT_LOCALE,
  ERROR_ROUTES,
  MARKDOWN_URL_EXTENSION_REGEX
} from './constants'
import {
  attachMeta,
  parseMeta,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkRemoveImports,
  remarkReplaceImports,
  remarkStaticImage,
  remarkStructurize
} from './mdx-plugins'
import theme from './theme.json'
import type {
  LoaderOptions,
  PageOpts,
  ReadingTime,
  StructurizedData
} from './types'
import { truthy } from './utils'

globalThis.__nextra_temp_do_not_use = () => {
  import('./__temp__')
}

const require = createRequire(import.meta.url)

const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS: RehypePrettyCodeOptions = {
  // @ts-expect-error -- TODO: fix type error
  theme,
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node: any) {
    node.properties.className = ['highlighted']
  },
  filterMetaString: (meta: string) =>
    meta.replace(CODE_BLOCK_FILENAME_REGEX, '')
}

const cachedCompilerForFormat: Record<
  Exclude<ProcessorOptions['format'], undefined | null>,
  Processor
> = Object.create(null)

type MdxOptions = LoaderOptions['mdxOptions'] &
  Pick<ProcessorOptions, 'jsx' | 'outputFormat'>

// @ts-expect-error -- Without bind is unable to use `remarkLinkRewrite` with `buildDynamicMDX`
// because we already use `remarkLinkRewrite` function to remove .mdx? extensions
const clonedRemarkLinkRewrite = remarkLinkRewrite.bind(null)

type CompileMdxOptions = Pick<
  LoaderOptions,
  | 'staticImage'
  | 'flexsearch'
  | 'defaultShowCopyCode'
  | 'readingTime'
  | 'latex'
  | 'codeHighlight'
> & {
  mdxOptions?: MdxOptions
  route?: string
  locale?: string
  filePath?: string
  useCachedCompiler?: boolean
  isPageImport?: boolean
}

export async function compileMdx(
  source: string,
  {
    staticImage,
    flexsearch,
    readingTime,
    latex,
    codeHighlight,
    defaultShowCopyCode,
    route = '',
    locale,
    mdxOptions,
    filePath = '',
    useCachedCompiler,
    isPageImport = true
  }: CompileMdxOptions = {}
) {
  // Extract frontMatter information if it exists
  const { data: frontMatter, content } = grayMatter(source)

  let searchIndexKey: string | null = null
  if (
    ERROR_ROUTES.has(route) ||
    route === '/_app' /* remove this check in v3 */
  ) {
    /* skip */
  } else if (typeof flexsearch === 'object') {
    if (flexsearch.indexKey) {
      searchIndexKey = flexsearch.indexKey(filePath, route, locale)
      if (searchIndexKey === '') {
        searchIndexKey = locale || DEFAULT_LOCALE
      }
    } else {
      searchIndexKey = locale || DEFAULT_LOCALE
    }
  } else if (flexsearch) {
    searchIndexKey = locale || DEFAULT_LOCALE
  }

  const {
    jsx = false,
    format: _format = 'mdx',
    outputFormat = 'function-body',
    remarkPlugins,
    rehypePlugins,
    rehypePrettyCodeOptions
  }: MdxOptions = {
    ...mdxOptions,
    // You can override MDX options in the frontMatter too.
    ...frontMatter.mdxOptions
  }

  const format =
    _format === 'detect' ? (filePath.endsWith('.mdx') ? 'mdx' : 'md') : _format

  // https://github.com/shuding/nextra/issues/1303
  const isFileOutsideCWD =
    !isPageImport && path.relative(CWD, filePath).startsWith('..')

  const isRemoteContent = outputFormat === 'function-body'

  const compiler =
    !useCachedCompiler || isRemoteContent
      ? createCompiler()
      : (cachedCompilerForFormat[format] ??= createCompiler())
  const processor = compiler()

  try {
    const vFile = await processor.process(
      filePath ? { value: content, path: filePath } : content
    )

    const { title, hasJsxInH1, readingTime, structurizedData } = vFile.data as {
      readingTime?: ReadingTime
      structurizedData: StructurizedData
      title?: string
    } & Pick<PageOpts, 'hasJsxInH1'>
    // https://github.com/shuding/nextra/issues/1032
    const result = String(vFile).replaceAll('__esModule', '_\\_esModule')

    return {
      result,
      ...(title && { title }),
      ...(hasJsxInH1 && { hasJsxInH1 }),
      ...(readingTime && { readingTime }),
      ...(searchIndexKey !== null && { searchIndexKey, structurizedData }),
      ...(isRemoteContent && { headings: vFile.data.headings }),
      frontMatter
    }
  } catch (err) {
    console.error(`[nextra] Error compiling ${filePath}.`)
    throw err
  }

  function createCompiler(): Processor {
    return createProcessor({
      jsx,
      format,
      outputFormat,
      providerImportSource: isFileOutsideCWD
        ? require.resolve('nextra').replace(/index\.js$/, 'mdx.js') // fixes Package subpath './mdx' is not defined by "exports"
        : 'nextra/mdx',
      remarkPlugins: [
        ...(remarkPlugins || []),
        remarkMermaid, // should be before remarkRemoveImports because contains `import { Mermaid } from ...`
        [
          remarkNpm2Yarn, // should be before remarkRemoveImports because contains `import { Tabs as $Tabs, Tab as $Tab } from ...`
          {
            packageName: 'nextra/components',
            tabNamesProp: 'items',
            storageKey: 'selectedPackageManager'
          }
        ] satisfies Pluggable,
        isRemoteContent && remarkRemoveImports,
        remarkGfm,
        format !== 'md' &&
          ([
            remarkMdxDisableExplicitJsx,
            // Replace the <summary> and <details> with customized components
            { whiteList: ['details', 'summary'] }
          ] satisfies Pluggable),
        remarkCustomHeadingId,
        [remarkHeadings, { isRemoteContent }] satisfies Pluggable,
        // structurize should be before remarkHeadings because we attach #id attribute to heading node
        flexsearch && ([remarkStructurize, flexsearch] satisfies Pluggable),
        staticImage && remarkStaticImage,
        readingTime && remarkReadingTime,
        latex && remarkMath,
        isFileOutsideCWD && remarkReplaceImports,
        // Remove the markdown file extension from links
        [
          clonedRemarkLinkRewrite,
          {
            pattern: MARKDOWN_URL_EXTENSION_REGEX,
            replace: '',
            excludeExternalLinks: true
          }
        ] satisfies Pluggable
      ].filter(truthy),
      rehypePlugins: [
        ...(rehypePlugins || []),
        format === 'md' && [
          // To render <details /> and <summary /> correctly
          rehypeRaw,
          // fix Error: Cannot compile `mdxjsEsm` node for npm2yarn and mermaid
          { passThrough: ['mdxjsEsm', 'mdxJsxFlowElement'] }
        ],
        [parseMeta, { defaultShowCopyCode }],
        // Should be before `rehypePrettyCode`
        latex && rehypeKatex,
        codeHighlight !== false &&
          ([
            rehypePrettyCode,
            {
              ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
              ...rehypePrettyCodeOptions
            }
          ] as any),
        attachMeta
      ].filter(truthy)
    })
  }
}
