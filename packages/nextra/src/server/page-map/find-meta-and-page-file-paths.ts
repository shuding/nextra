import path from 'node:path'
import fg from 'fast-glob'
import slash from 'slash'

export async function findMetaAndPageFilePaths({
  dir,
  cwd,
  locale = '',
  // Can be `src/content` also
  contentDir = 'content'
}: {
  dir: string
  cwd: string
  locale?: string
  contentDir?: string
}): Promise<string[]> {
  const appDir = slash(path.relative(cwd, dir))
  if (locale) contentDir += `/${locale}`
  // appDir is empty string on tests
  const pattern = appDir
    ? [
        `${contentDir}/**/_meta.{js,jsx,ts,tsx}`, // Include `_meta` files from `content` directory
        `${contentDir}/**/*.{md,mdx}`, // Include all Markdown/MDX files from `content` directory
        `${appDir}/**/page.{js,jsx,jsx,tsx,md,mdx}`,
        `${appDir}/**/_meta.{js,jsx,ts,tsx}`, // Include `_meta` files from `app` directory
        `${appDir}/_meta.global.{js,jsx,ts,tsx}`, // Include global `_meta` file from `app` directory
        `!${appDir}/**/{_,[}*/*` // Ignore subdirectories starting with `_` and dynamic routes
      ]
    : ['**/_meta.{js,jsx,ts,tsx}', '**/*.{md,mdx}']
  const result = await fg(pattern, { cwd })
  // Sort file paths alphabetically because there is different order on each
  // fast-glob invocation
  const relativePaths = result.sort((a, b) => a.localeCompare(b))
  return relativePaths
}
