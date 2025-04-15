import type { ProcessorOptions } from '@mdx-js/mdx'
import { createProcessor } from '@mdx-js/mdx'
import { remarkMermaid } from '@theguild/remark-mermaid'
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
import type { LoaderOptions, NextraConfig } from '../types.js'
import { MARKDOWN_URL_EXTENSION_RE } from './constants.js'
import { recmaRewrite } from './recma-plugins/index.js'
import {
  DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
  rehypeAttachCodeMeta,
  rehypeBetterReactMathjax,
  rehypeExtractTocContent,
  rehypeParseCodeMeta,
  rehypeTwoslashPopup
} from './rehype-plugins/index.js'
import {
  remarkAssignFrontMatter,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkMdxFrontMatter,
  remarkMdxTitle,
  remarkRemoveImports,
  remarkStaticImage
} from './remark-plugins/index.js'

type Processor = ReturnType<typeof createProcessor>

const cachedCompilerForFormat: Record<
  `${NonNullable<ProcessorOptions['format']>}:${boolean}`,
  Processor | void
> = Object.create(null)

type MdxOptions = NextraConfig['mdxOptions'] &
  Pick<ProcessorOptions, 'jsx' | 'outputFormat' | 'providerImportSource'>

type CompileMdxOptions = Pick<
  LoaderOptions,
  | 'staticImage'
  | 'search'
  | 'defaultShowCopyCode'
  | 'readingTime'
  | 'latex'
  | 'codeHighlight'
  | 'whiteListTagsStyling'
> & {
  /** @default {} */
  mdxOptions: MdxOptions
  /** @default '' */
  filePath: string
  useCachedCompiler: boolean
  /** @default false */
  isPageImport: boolean
  lastCommitTime: number
}

/**
 * @example
 * ```ts
 * // Usage with MDXRemote
 * import { compileMdx } from 'nextra/compile'
 * import { MDXRemote } from 'nextra/mdx-remote'
 *
 * const rawJs = await compileMdx(rawMdx)
 * const content = <MDXRemote compiledSource={rawJs} components={...} scope={...} />
 * ```
 */
export async function compileMdx(
  rawMdx: string,
  {
    staticImage,
    search,
    readingTime,
    latex,
    codeHighlight,
    defaultShowCopyCode,
    mdxOptions = {},
    filePath = '',
    useCachedCompiler,
    isPageImport = false,
    whiteListTagsStyling = [],
    lastCommitTime
  }: Partial<CompileMdxOptions> = {}
): Promise<string> {
  const {
    jsx = false,
    format: _format = 'mdx',
    outputFormat = 'function-body',
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
    rehypePrettyCodeOptions,
    providerImportSource = 'next-mdx-import-source-file'
  } = mdxOptions

  const format =
    _format === 'detect' ? (filePath.endsWith('.mdx') ? 'mdx' : 'md') : _format

  const fileCompatible = filePath ? { value: rawMdx, path: filePath } : rawMdx

  const isRemoteContent = outputFormat === 'function-body'

  const compiler =
    !useCachedCompiler || isRemoteContent
      ? createCompiler()
      : (cachedCompilerForFormat[`${format}:${isPageImport}`] ||=
          createCompiler())
  const processor = compiler()

  try {
    const vFile = await processor.process(fileCompatible)
    const rawJs = (vFile.value as string)
      // https://github.com/shuding/nextra/issues/1032
      .replaceAll('__esModule', String.raw`_\_esModule`)
    return rawJs
  } catch (error) {
    console.error(`[nextra] Error compiling ${filePath}.`)
    throw error
  }

  function createCompiler(): Processor {
    return createProcessor({
      jsx,
      format,
      outputFormat,
      providerImportSource,
      // Fix TypeError: _jsx is not a function for remote content
      development: process.env.NODE_ENV === 'development',
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
        remarkFrontmatter, // parse and attach yaml node
        remarkMdxFrontMatter,
        readingTime && remarkReadingTime,
        // before mdx title
        remarkCustomHeadingId,
        remarkMdxTitle,
        [remarkAssignFrontMatter, { lastCommitTime }] satisfies Pluggable,
        remarkGfm,
        format !== 'md' &&
          ([
            remarkMdxDisableExplicitJsx,
            // Replace the <summary> and <details> with customized components
            { whiteList: ['details', 'summary', ...whiteListTagsStyling] }
          ] satisfies Pluggable),
        [remarkHeadings, { isRemoteContent }] satisfies Pluggable,
        staticImage && remarkStaticImage,
        latex && remarkMath,
        // Remove the markdown file extension from links
        [
          remarkLinkRewrite,
          {
            pattern: MARKDOWN_URL_EXTENSION_RE,
            replace: '',
            excludeExternalLinks: true
          }
        ] satisfies Pluggable,
        remarkSmartypants
      ].filter(v => !!v),
      rehypePlugins: [
        ...(rehypePlugins || []),
        format === 'md' && [
          // To render `<details>` and `<summary>` correctly
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
                  ...rehypePrettyCodeOptions
                }
              ] as any,
              rehypeTwoslashPopup,
              [rehypeAttachCodeMeta, { search }]
            ]),
        rehypeExtractTocContent
      ].filter(v => !!v),
      recmaPlugins: [
        ...(recmaPlugins || []),
        [recmaRewrite, { isPageImport, isRemoteContent }] satisfies Pluggable
      ]
    })
  }
}
