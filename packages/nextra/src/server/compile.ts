import path from 'node:path'
import type { ProcessorOptions } from '@mdx-js/mdx'
import { createProcessor } from '@mdx-js/mdx'
import type { Processor } from '@mdx-js/mdx/lib/core'
import { remarkMermaid } from '@theguild/remark-mermaid'
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import type { Program } from 'estree'
import rehypeKatex from 'rehype-katex'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkReadingTime from 'remark-reading-time'
import { bundledLanguages, getHighlighter } from 'shiki'
import type { Pluggable } from 'unified'
import type {
  FrontMatter,
  LoaderOptions,
  PageOpts,
  ReadingTime,
  StructurizedData
} from '../types'
import {
  CODE_BLOCK_FILENAME_REGEX,
  CWD,
  DEFAULT_LOCALE,
  ERROR_ROUTES,
  MARKDOWN_URL_EXTENSION_REGEX
} from './constants.js'
import {
  attachMeta,
  parseMeta,
  recmaRewriteJsx,
  rehypeIcon,
  remarkCustomHeadingId,
  remarkHeadings,
  remarkLinkRewrite,
  remarkMdxDisableExplicitJsx,
  remarkMdxFrontMatter,
  remarkRemoveImports,
  remarkStaticImage,
  remarkStructurize
} from './mdx-plugins/index.js'
import { rehypeExtractTocContent } from './mdx-plugins/rehype-extract-toc-content.js'
import { truthy } from './utils.js'

export const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS: RehypePrettyCodeOptions = {
  keepBackground: false,
  grid: false,
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children.push({ type: 'text', value: ' ' })
    }
    delete node.properties['data-line']
  },
  filterMetaString: meta => meta.replace(CODE_BLOCK_FILENAME_REGEX, ''),
  async getHighlighter(_opts) {
    const DEFAULT_OPTS = {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      defaultColor: false
    } as const

    const highlighter = await getHighlighter({
      themes: Object.values(DEFAULT_OPTS.themes),
      langs: Object.keys(bundledLanguages)
    })

    const originalCodeToHtml = highlighter.codeToHtml

    return Object.assign(highlighter, {
      codeToHtml(code: string, lang: string) {
        return originalCodeToHtml(code, { lang, ...DEFAULT_OPTS })
      },
      ansiToHtml(code: string) {
        return this.codeToHtml(code, 'ansi')
      }
    })
  }
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
  isPageImport?: boolean
  isPageMapImport?: boolean
}

export async function compileMdx(
  source: string,
  {
    staticImage,
    search,
    readingTime,
    latex,
    codeHighlight,
    defaultShowCopyCode,
    route = '',
    locale,
    mdxOptions = {},
    filePath = '',
    useCachedCompiler,
    isPageImport = true,
    isPageMapImport
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

  if (rehypePrettyCodeOptions) {
    throw new Error(
      "`rehypePrettyCodeOptions` is currently unsupported since `rehype-pretty-code` doesn't support `shikiji` package"
    )
  }

  const format =
    _format === 'detect' ? (filePath.endsWith('.mdx') ? 'mdx' : 'md') : _format

  if (isPageMapImport) {
    const compiler = createProcessor({
      format,
      remarkPlugins: [
        remarkFrontmatter, // parse and attach yaml node
        remarkMdxFrontMatter
      ]
    })
    const vFile = await compiler.process(
      filePath ? { value: source, path: filePath } : source
    )
    const content = vFile.toString()

    const index = content.lastIndexOf('function _createMdxContent(props) {')
    const result = content.slice(0, index)

    return { result } as any
  }

  let searchIndexKey: string | null = null
  if (ERROR_ROUTES.has(route)) {
    /* skip */
  } else if (typeof search === 'object') {
    if (search.indexKey) {
      searchIndexKey = search.indexKey(filePath, route, locale)
      if (searchIndexKey === '') {
        searchIndexKey = locale || DEFAULT_LOCALE
      }
    } else {
      searchIndexKey = locale || DEFAULT_LOCALE
    }
  } else if (search) {
    searchIndexKey = locale || DEFAULT_LOCALE
  }

  // https://github.com/shuding/nextra/issues/1303
  const isFileOutsideCWD =
    !isPageImport && path.relative(CWD, filePath).startsWith('..')

  if (isFileOutsideCWD) {
    throw new Error(
      `Unexpected import of "${filePath}" that is outside of working directory, use symlinks instead`
    )
  }

  const isRemoteContent = outputFormat === 'function-body'

  const compiler =
    !useCachedCompiler || isRemoteContent
      ? createCompiler()
      : (cachedCompilerForFormat[format] ??= createCompiler())
  const processor = compiler()

  try {
    const fileCompatible = filePath ? { value: source, path: filePath } : source
    const vFile = await processor.process(fileCompatible)

    const { title, hasJsxInH1, readingTime, structurizedData } = vFile.data as {
      readingTime?: ReadingTime
      structurizedData: StructurizedData
      title?: string
    } & Pick<PageOpts, 'hasJsxInH1'>
    // https://github.com/shuding/nextra/issues/1032
    const result = String(vFile).replaceAll('__esModule', '_\\_esModule')

    const frontMatter = (vFile.data.frontMatter || {}) as FrontMatter

    if (frontMatter.mdxOptions) {
      throw new Error('`frontMatter.mdxOptions` is no longer supported')
    }

    // const { toc } = vFile.data as any

    // const tocVFile = await createProcessor({
    //   jsx,
    //   format,
    //   outputFormat,
    //   providerImportSource: 'nextra/mdx',
    //   rehypePlugins: [
    //     () => ast => {
    //       // Insert heading contents
    //       // @ts-expect-error
    //       ast.children = toc.map(node => ({
    //         type: 'mdxJsxFlowElement',
    //         children: node.children
    //       }))
    //     }
    //   ],
    //   recmaPlugins: [
    //     () => (ast: Program) => {
    //       // Remove top-level comment since main content have it already
    //       ast.comments = ast.comments!.filter(
    //         comment =>
    //           comment.value !== '@jsxRuntime automatic @jsxImportSource react'
    //       )
    //       // Remove MDXContent export and definition
    //       ast.body = ast.body
    //         .filter(
    //           node =>
    //             node.type !== 'ExportDefaultDeclaration' ||
    //             // @ts-expect-error
    //             node.declaration.name !== 'MDXContent'
    //         )
    //         // Remove function definition
    //         .filter(
    //           node =>
    //             node.type !== 'FunctionDeclaration' ||
    //             // @ts-expect-error
    //             node.id.name !== 'MDXContent'
    //         )
    //         .filter(
    //           node =>
    //             node.type !== 'ImportDeclaration' ||
    //             node.source.value !== 'nextra/mdx'
    //         )
    //
    //       // Rename `_createMdxContent` to `useToc`
    //       const createMdxContent = ast.body.find(
    //         node =>
    //           node.type === 'FunctionDeclaration' &&
    //           // @ts-expect-error
    //           node.id.name === '_createMdxContent'
    //       ) as any
    //       createMdxContent.id.name = 'useToc'
    //
    //       const returnStatement = createMdxContent.body.body.find(
    //         // @ts-expect-error
    //         node => node.type === 'ReturnStatement'
    //       )
    //       const headings = returnStatement.argument.children
    //
    //       // for (const heading of headings) {
    //       //   const idNode = heading.openingElement.attributes.find(
    //       //     (attr: JsxAttribute) => attr.name.name === 'id'
    //       //   )
    //       // }
    //
    //       // @ts-expect-error
    //       const elements = headings.map((node, i) => {
    //         const isText = node.children.every(
    //           // @ts-expect-error
    //           child =>
    //             child.type === 'JSXExpressionContainer' &&
    //             child.expression.type === 'Literal'
    //         )
    //
    //         const result = isText
    //           // @ts-expect-error
    //           ? node.children.map(n => n.expression)[0]
    //           : {
    //               type: 'JSXFragment',
    //               openingFragment: { type: 'JSXOpeningFragment' },
    //               closingFragment: { type: 'JSXClosingFragment' },
    //               children: node.children
    //             }
    //
    //         return {
    //           type: 'ObjectExpression',
    //           properties: [
    //             {
    //               type: 'Property',
    //               key: { type: 'Identifier', name: 'value' },
    //               value: result,
    //               kind: 'init'
    //             },
    //             {
    //               type: 'Property',
    //               key: { type: 'Identifier', name: 'id' },
    //               value: { type: 'Literal', value: toc[i].properties.id },
    //               kind: 'init'
    //             },
    //             {
    //               type: 'Property',
    //               key: { type: 'Identifier', name: 'depth' },
    //               value: { type: 'Literal', value: Number(toc[i].tagName[1]) },
    //               kind: 'init'
    //             }
    //           ]
    //         }
    //       })
    //       returnStatement.argument = {
    //         type: 'ArrayExpression',
    //         elements
    //       }
    //     }
    //   ]
    // }).process(filePath ? { value: '', path: filePath } : '')

    return {
      result,
      // result: result + String(tocVFile),
      ...(title && { title }),
      ...(hasJsxInH1 && { hasJsxInH1 }),
      ...(readingTime && { readingTime }),
      ...(searchIndexKey !== null && { searchIndexKey, structurizedData }),
      ...(isRemoteContent && { toc: vFile.data.headings }),
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
      providerImportSource: 'nextra/mdx',
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
        [remarkMdxFrontMatter, { isRemoteContent }] satisfies Pluggable,
        remarkGfm,
        format !== 'md' &&
          ([
            remarkMdxDisableExplicitJsx,
            // Replace the <summary> and <details> with customized components
            { whiteList: ['details', 'summary'] }
          ] satisfies Pluggable),
        remarkCustomHeadingId,
        [remarkHeadings, { isRemoteContent }] satisfies Pluggable,
        // structurize should be before `remarkHeadings` because we attach #id attribute to heading node
        search && ([remarkStructurize, search] satisfies Pluggable),
        staticImage && remarkStaticImage,
        readingTime && remarkReadingTime,
        latex && remarkMath,
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
          {
            passThrough: ['mdxjsEsm', 'mdxJsxFlowElement', 'mdxTextExpression']
          }
        ],
        [parseMeta, { defaultShowCopyCode }],
        ...(codeHighlight === false
          ? []
          : [
              [rehypePrettyCode, DEFAULT_REHYPE_PRETTY_CODE_OPTIONS] as any,
              !isRemoteContent && rehypeIcon,
              attachMeta
            ]),
        latex && rehypeKatex,
        rehypeExtractTocContent
      ].filter(truthy),
      recmaPlugins: [!isRemoteContent && recmaRewriteJsx].filter(truthy)
    })
  }
}
