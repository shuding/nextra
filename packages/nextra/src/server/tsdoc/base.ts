import path from 'node:path'
import slash from 'slash'
import type {
  ExportedDeclarations,
  Node as TsNode,
  Symbol as TsSymbol,
  Type
} from 'ts-morph'
import { Project, SyntaxKind, ts } from 'ts-morph'
import { CWD } from '../constants.js'
import { logger } from '../utils.js'
import type {
  BaseArgs,
  GeneratedDefinition,
  GeneratedFunction,
  GeneratedType,
  Tags,
  TypeField
} from './types.js'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    // Do not show `undefined` value in type for optional value
    exactOptionalPropertyTypes: true,
    // Show `null` value in type if exist
    strictNullChecks: true
  }
})

const DEFAULT_FILENAME = '$.ts'

let compilerObject: ts.TypeChecker

/**
 * Generate documentation for properties of `type` and `interface` and parameters and returns
 * signature of `function`.
 * @returns Parsed TSDoc definition from TypeScript `type`, `interface` or `function`.
 * @example
 * To generate documentation for a `type`, `interface`, or `function`, export it via the `code`
 * argument.
 *
 * ### As a `default` export
 *
 * ```mdx
 * import { generateDefinition, TSDoc } from 'nextra/tsdoc'
 *
 * <TSDoc
 *   definition={generateDefinition({
 *     code: "export { yourTypeOrFunction as default } from 'your-package'",
 *   })}
 * />
 * ```
 *
 * ### As a named export
 *
 * ```mdx
 * import { generateDefinition, TSDoc } from 'nextra/tsdoc'
 *
 * <TSDoc
 *   definition={generateDefinition({
 *     code: "export { yourTypeOrFunction } from 'your-package'",
 *     exportName: 'yourTypeOrFunction'
 *   })}
 * />
 * ```
 */
export function generateDefinition({
  code,
  exportName = 'default',
  flattened = false
}: BaseArgs): GeneratedDefinition & (GeneratedType | GeneratedFunction) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Can't access at top level, fix File not found: /var/task/.../tsconfig.json
  compilerObject ??= project.getTypeChecker().compilerObject
  const sourceFile = project.createSourceFile(DEFAULT_FILENAME, code, {
    overwrite: true
  })
  const output: ExportedDeclarations[] = []
  for (const [key, declaration] of sourceFile.getExportedDeclarations()) {
    if (key === exportName) output.push(...declaration)
  }
  const declaration = output[0]
  if (!declaration) {
    throw new Error(`Can't find "${exportName}" declaration`)
  }
  // if (output.length > 1) {
  //   throw new Error(
  //     `Export "${exportName}" should not have more than one type declaration.`
  //   )
  // }
  const declarationFilePath = declaration.getSourceFile().getFilePath()
  const filePath = slash(path.relative(CWD, declarationFilePath))
  const symbol = declaration.getSymbolOrThrow()
  const { comment, tags } = getCommentAndTags(declaration)
  const description = ts.displayPartsToString(comment)
  tags.returns &&= replaceJsDocLinks(tags.returns)

  const definition: GeneratedDefinition = {
    // Skip adding `filePath` to snapshots on test env, since we have tests on Mac and on Windows, they fail
    ...// process.env.NODE_ENV !== 'test' &&
    (filePath !== DEFAULT_FILENAME && { filePath }),
    name: symbol.getName(),
    ...(description && { description }),
    ...(Object.keys(tags).length && { tags })
  }

  const declarationType = declaration.getType()
  const callSignatures = declarationType.getCallSignatures()
  const isFunction = callSignatures.length > 0

  if (!isFunction) {
    const entries = declarationType
      .getProperties()
      .flatMap(prop =>
        getDocEntry({
          symbol: prop,
          declaration,
          flattened
        })
      )
      .filter(entry => !entry.tags || !('internal' in entry.tags))
    if (!entries.length) {
      const typeName = declarationType.getText()
      if (typeName === 'any') {
        throw new Error(
          'Your type is resolved as "any", it seems like you have an issue in "generateDefinition.code" argument.'
        )
      }
      throw new Error(
        `No properties found, check if your type "${typeName}" exist.`
      )
    }

    return {
      ...definition,
      entries
    }
  }
  return {
    ...definition,
    signatures: callSignatures.map(signature => {
      const params = signature.getParameters()
      const typeParams = params.flatMap(param =>
        getDocEntry({
          symbol: param,
          declaration,
          flattened
        })
      )
      // signature.getReturnType() evaluates and expands the type fully, we use signature.getDeclaration().getSignature().getReturnType()
      const returnType = signature
        .getDeclaration()
        .getSignature()
        .getReturnType()
      let flattenedReturnType: GeneratedFunction['signatures'][number]['returns'] =
        flattened && shouldFlattenType(returnType)
          ? returnType.getProperties().flatMap(childProp =>
              getDocEntry({
                symbol: childProp,
                declaration,
                flattened
              })
            )
          : []

      if (!flattenedReturnType.length) {
        flattenedReturnType = {
          type: getFormattedText(returnType)
        }
      }

      return {
        params: typeParams,
        returns: flattenedReturnType
      }
    })
  }
}

/**
 * If no comments are found on the symbol, use the alias symbol's comments.
 */
function getCommentAndTags(declaration: ExportedDeclarations): {
  comment: ts.SymbolDisplayPart[]
  tags: Tags
} {
  const symbol = declaration.getSymbolOrThrow()
  const comment = symbol.compilerSymbol.getDocumentationComment(compilerObject)
  if (!comment.length) {
    const aliasSymbol = declaration.getType().getAliasSymbol()
    if (aliasSymbol) {
      return {
        comment:
          aliasSymbol.compilerSymbol.getDocumentationComment(compilerObject),
        tags: getTags(aliasSymbol)
      }
    }
  }
  return {
    comment,
    tags: getTags(symbol)
  }
}

function getDocEntry({
  symbol,
  declaration,
  flattened,
  prefix = ''
}: {
  symbol: TsSymbol
  declaration: ExportedDeclarations
  flattened: boolean
  prefix?: string
}): TypeField | TypeField[] {
  const originalSubType = project
    .getTypeChecker()
    .getTypeOfSymbolAtLocation(symbol, declaration)
  const valueDeclaration = symbol.getValueDeclaration()
  const isFunctionParameter =
    valueDeclaration && valueDeclaration.getKind() === SyntaxKind.Parameter

  const subType = isFunctionParameter
    ? originalSubType.getNonNullableType()
    : originalSubType
  if (flattened && shouldFlattenType(subType)) {
    return subType.getProperties().flatMap(childProp => {
      const childPrefix = isFunctionParameter
        ? symbol.getName().replace(/^_+/, '')
        : symbol.getName()
      const newPrefix =
        typeof +childPrefix === 'number' && !Number.isNaN(+childPrefix)
          ? `[${childPrefix}]` + (originalSubType.isNullable() ? '?' : '')
          : childPrefix
      return getDocEntry({
        symbol: childProp,
        declaration,
        flattened,
        prefix: prexify(prefix, newPrefix)
      })
    })
  }
  const tags = getTags(symbol)

  const name = symbol.getName()
  const typeDescription = replaceJsDocLinks(
    ts.displayPartsToString(
      symbol.compilerSymbol.getDocumentationComment(compilerObject)
    )
  ).replace(/^- /, '')
  const isOptional = isFunctionParameter
    ? // @ts-expect-error -- fixme
      valueDeclaration.isOptional()
    : symbol.isOptional()

  const typeName = getTypeName({
    tags,
    symbol,
    subType,
    valueDeclaration
  })
  return {
    name: prexify(prefix, name),
    type: typeName,
    ...(typeDescription && { description: typeDescription }),
    ...(Object.keys(tags).length && { tags }),
    ...(isOptional && { optional: isOptional })
  }
}

function getTypeName({
  tags,
  symbol,
  subType,
  valueDeclaration
}: {
  tags: Tags
  symbol: TsSymbol
  subType: Type
  valueDeclaration: TsNode | undefined
}) {
  const aliasSymbol = subType.getAliasSymbol()
  const subTypeTags = aliasSymbol ? getTags(aliasSymbol) : {}
  const typeName = (tags.remarks || subTypeTags.remarks)?.match(
    /^`(?<name>.+)`/
  )?.groups!.name

  if (typeName) {
    return typeName
  }

  const declarationNode = symbol
    .getDeclarations()
    .find(
      d =>
        ts.isPropertySignature(d.compilerNode) || ts.isParameter(d.compilerNode)
    )
  const typeNode =
    declarationNode?.asKind(SyntaxKind.PropertySignature) ??
    declarationNode?.asKind(SyntaxKind.Parameter)
  const t = typeNode?.getTypeNode()?.getText()

  const useTypeNode =
    t &&
    (t.startsWith('Partial<') ||
      ['React.ReactNode', 'React.ReactElement'].includes(t))

  if (useTypeNode) {
    return t
  }
  const isInline = 'inline' in tags || 'inline' in subTypeTags

  if (!isInline) {
    const typeOf = valueDeclaration?.getType() ?? symbol.getDeclaredType()
    return typeOf.isUnknown() ? 'unknown' : getFormattedText(subType)
  }
  const [signature] = subType.getCallSignatures()
  const isFunction = !!signature
  if (isFunction) {
    const params = signature.getParameters().map(param => {
      const paramDecl = param.getDeclarations()[0]!
      const paramType = project
        .getTypeChecker()
        .getTypeOfSymbolAtLocation(param, paramDecl)
      const inlineParamAlias = paramType.getNonNullableType().getAliasSymbol()
      const paramTags = inlineParamAlias && getTags(inlineParamAlias)

      const paramTypeStr =
        paramTags && 'inline' in paramTags
          ? inlineParamAlias
              .getDeclarations()[0]!
              .asKindOrThrow(SyntaxKind.TypeAliasDeclaration)
              .getTypeNodeOrThrow()
              .getText()
          : getFormattedText(paramType)
      const optional = paramDecl
        .asKindOrThrow(SyntaxKind.Parameter)
        .isOptional()

      return `${param.getName()}${optional ? '?' : ''}: ${paramTypeStr}`
    })

    return `(${params.join(', ')}) => ${getFormattedText(signature.getReturnType())}`
  }
  const [aliasDecl] = aliasSymbol!.getDeclarations()
  if (!aliasDecl) {
    throw new Error("Can't find alias declaration for type.")
  }
  const inlineNode = aliasDecl
    .asKindOrThrow(SyntaxKind.TypeAliasDeclaration)
    .getTypeNodeOrThrow()
  return inlineNode.getText()
}

function prexify(prefix: string, name: string): string {
  return prefix ? [prefix, name].join('.') : name
}

function shouldFlattenType(t: Type): boolean {
  if (
    !t.isObject() ||
    t.isArray() ||
    t.isTuple() ||
    // Is not function
    t.getCallSignatures().length > 0 ||
    // Is not `unknown`
    t.getText() === '{}' ||
    // Is not an empty object
    !t.getProperties().length
  ) {
    return false
  }
  try {
    const baseName = t.getSymbolOrThrow().getName()
    if (IGNORED_TYPES.has(baseName)) return false
    return t.isInterface() || baseName === '__type' || baseName === '__object'
  } catch {
    logger.error(`Symbol "${t.getText()}" isn't found.`)
    return false
  }
}

const IGNORED_TYPES = new Set([
  'Date',
  'RegExp',
  'ReactElement',
  'Element',
  'CSSProperties'
])

function getTags(prop: TsSymbol): Tags {
  const tags: Record<string, string> = Object.create(null)
  for (const tag of prop.getJsDocTags()) {
    const tagName = tag.getName()
    const tagValue = ts.displayPartsToString(tag.getText())
    if (tagName in tags) {
      tags[tagName] += `\n${tagValue}`
    } else {
      tags[tagName] = tagValue
    }
  }
  return tags
}

function getFormattedText(t: Type): string {
  return t.getText(
    undefined,
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  )
}

function replaceJsDocLinks(md: string): string {
  return md.replaceAll(/{@link (?<link>[^}]*)}/g, '$1')
}
