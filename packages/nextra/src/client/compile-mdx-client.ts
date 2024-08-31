import type { ProcessorOptions } from '@mdx-js/mdx'
import { createProcessor } from '@mdx-js/mdx'
import type { Processor } from '@mdx-js/mdx/lib/core'
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkReadingTime from 'remark-reading-time'
import remarkSmartypants from 'remark-smartypants'
import type { Pluggable } from 'unified'
import { recmaRewriteFunctionBody } from '../server/recma-plugins/index.js'
import {
  DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
  rehypeAttachCodeMeta,
  rehypeBetterReactMathjax,
  rehypeIcon,
  rehypeParseCodeMeta
} from '../server/rehype-plugins/index.js'
import { truthy } from '../server/utils.js'
import type { LoaderOptions } from '../types'

const cachedCompilerForFormat: Record<
  Exclude<ProcessorOptions['format'], undefined | null>,
  Processor
> = Object.create(null)

type MdxOptions = LoaderOptions['mdxOptions'] &
  Pick<ProcessorOptions, 'jsx' | 'outputFormat'>

// Without bind is unable to use `remarkLinkRewrite` with `buildDynamicMDX`
// because we already use `remarkLinkRewrite` function to remove .mdx? extensions
// const clonedRemarkLinkRewrite = remarkLinkRewrite.bind(null)

type CompileMdxOptions = Pick<
  LoaderOptions,
  | 'staticImage'
  | 'search'
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
  isPageMapImport?: boolean
}

export async function compileMdxClient(
  source: string,
  {
    readingTime,
    latex,
    codeHighlight,
    defaultShowCopyCode,
    mdxOptions = {},
    filePath = '',
    useCachedCompiler
  }: CompileMdxOptions = {}
) {
  const {
    jsx = false,
    format: _format = 'mdx',
    outputFormat = 'function-body',
    remarkPlugins,
    rehypePlugins,
    rehypePrettyCodeOptions
  }: MdxOptions = mdxOptions

  const format =
    _format === 'detect' ? (filePath.endsWith('.mdx') ? 'mdx' : 'md') : _format

  const fileCompatible = filePath ? { value: source, path: filePath } : source

  const isRemoteContent = outputFormat === 'function-body'

  const compiler =
    !useCachedCompiler || isRemoteContent
      ? createCompiler()
      : (cachedCompilerForFormat[format] ??= createCompiler())
  const processor = compiler()

  try {
    const vFile = await processor.process(fileCompatible)

    // https://github.com/shuding/nextra/issues/1032
    const result = String(vFile).replaceAll('__esModule', '_\\_esModule')

    return { result }
  } catch (error) {
    console.error(`[nextra] Error compiling ${filePath}.`)
    throw error
  }

  function createCompiler(): Processor {
    return createProcessor({
      jsx,
      format,
      outputFormat,
      providerImportSource: 'nextra/mdx',
      // Fix TypeError: _jsx is not a function for remote content
      development: process.env.NODE_ENV === 'development',
      // remarkMermaid, remarkRemoveImports, remarkMdxFrontMatter, remarkMdxDisableExplicitJsx, remarkCustomHeadingId
      // remarkMdxTitle, remarkHeadings, remarkStructurize, remarkStaticImage, clonedRemarkLinkRewrite, and rehypeExtractTocContent
      // are not client compatible in most cases because they depend on 'path' which is only available server-side
      remarkPlugins: [
        ...(remarkPlugins || []),
        [
          remarkNpm2Yarn, // should be before remarkRemoveImports because contains `import { Tabs as $Tabs, Tab as $Tab } from ...`
          {
            packageName: 'nextra/components',
            tabNamesProp: 'items',
            storageKey: 'selectedPackageManager'
          }
        ] satisfies Pluggable,
        remarkFrontmatter, // parse and attach yaml node
        remarkGfm,
        readingTime && remarkReadingTime,
        latex && remarkMath,
        remarkSmartypants
      ].filter(truthy),
      rehypePlugins: [
        ...(rehypePlugins || []),
        format === 'md' && [
          // To render <details /> and <summary /> correctly
          rehypeRaw,
          // fix Error: Cannot compile `mdxjsEsm` node for npm2yarn and mermaid
          {
            passThrough: ['mdxjsEsm', 'mdxJsxFlowElement', 'mdxTextExpression']
          }
        ],
        [rehypeParseCodeMeta, { defaultShowCopyCode }],
        // Should be before `rehypePrettyCode`
        latex &&
          (typeof latex === 'object'
            ? latex.renderer === 'mathjax'
              ? [rehypeBetterReactMathjax, latex.options, isRemoteContent]
              : [rehypeKatex, latex.options]
            : rehypeKatex),
        ...(codeHighlight === false
          ? []
          : [
              [
                rehypePrettyCode,
                {
                  ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
                  // transformerTwoslash Error: Cannot find module 'path' in remote content,
                  // disable twoslash because client cannot access 'path' dep
                  ...rehypePrettyCodeOptions
                }
              ] as any,
              !isRemoteContent && rehypeIcon,
              rehypeAttachCodeMeta
            ])
      ].filter(truthy),
      recmaPlugins: [recmaRewriteFunctionBody]
    })
  }
}
