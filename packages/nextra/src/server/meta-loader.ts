import type { LoaderContext } from 'webpack'

/**
 * A webpack loader that transforms _meta files to preserve key order.
 * 
 * JavaScript reorders numeric string keys in objects (e.g., '1140', '1130' become '1130', '1140').
 * This loader parses the source to extract the original key order and injects it as `__order__`.
 * 
 * @see https://github.com/shuding/nextra/issues/4834
 */

// Regex to match object property keys in the source
// Handles: 'key', "key", key:, 'key':, "key":
const KEY_REGEX = /(?:^|[,{]\s*)(?:'([^']+)'|"([^"]+)"|(\w[\w-]*))(?:\s*:)/gm

export function extractKeysFromSource(source: string): string[] {
    const keys: string[] = []

    // Find the default export object
    const exportMatch = source.match(/export\s+default\s*({[\s\S]*})/)
    if (!exportMatch) {
        return keys
    }

    const objectContent = exportMatch[1]
    if (!objectContent) {
        return keys
    }

    // Track brace depth to only get top-level keys
    let depth = 0
    let currentPos = 0

    for (let i = 0; i < objectContent.length; i++) {
        const char = objectContent[i]

        if (char === '{') {
            depth++
            if (depth === 1) {
                currentPos = i + 1
            }
        } else if (char === '}') {
            depth--
        } else if (depth === 1) {
            // Only process at the first brace level
            // Check if we're at the start of a key
            const remaining = objectContent.slice(i)

            // Match quoted key: 'key' or "key"
            const quotedMatch = remaining.match(/^(['"])([^'"]+)\1\s*:/)
            if (quotedMatch) {
                keys.push(quotedMatch[2]!)
                i += quotedMatch[0].length - 1
                continue
            }

            // Match unquoted key: key:
            const unquotedMatch = remaining.match(/^([\w][\w-]*)\s*:/)
            if (unquotedMatch && !remaining.startsWith('type:') && !remaining.startsWith('items:') && !remaining.startsWith('title:') && !remaining.startsWith('href:') && !remaining.startsWith('display:') && !remaining.startsWith('theme:')) {
                // Skip common nested property names
                keys.push(unquotedMatch[1]!)
                i += unquotedMatch[0].length - 1
                continue
            }
        }
    }

    return keys
}

export async function metaLoader(
    this: LoaderContext<{}>,
    source: string
): Promise<string> {
    // Extract key order from source
    const keys = extractKeysFromSource(source)

    if (keys.length === 0) {
        // No transformation needed
        return source
    }

    // Inject __order__ property into the exported object
    // Transform: export default { ... }
    // To: export default { __order__: [...], ... }

    const transformed = source.replace(
        /export\s+default\s*{/,
        `export default { __order__: ${JSON.stringify(keys)},`
    )

    return transformed
}

export default metaLoader
