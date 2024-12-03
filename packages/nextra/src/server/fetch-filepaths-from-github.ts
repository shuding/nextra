import fs from 'node:fs/promises'
import { MARKDOWN_EXTENSION_RE } from './constants.js'

type Params = {
  user: string
  repo: string
  branch: string
  docsPath: string
  outputPath: string
}

export async function fetchFilePathsFromGitHub({
  user,
  repo,
  branch,
  docsPath,
  outputPath
}: Params): Promise<void> {
  const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`
  const response = await fetch(url)

  const data = await response.json()
  if (data.message) {
    console.error(
      '❌ GitHub API rate limit exceeded, skipping…',
      JSON.stringify(data, null, 2)
    )
    // eslint-disable-next-line unicorn/no-process-exit -- This file is a CLI
    process.exit(0)
  }
  const filePaths = (data.tree as { path: string }[])
    .filter(item => item.path.startsWith(docsPath))
    .map(item => item.path.replace(docsPath, ''))

  const result = {
    user,
    repo,
    branch,
    docsPath,
    filePaths: filePaths.filter(filePath =>
      MARKDOWN_EXTENSION_RE.test(filePath)
    )
  }
  const json = JSON.stringify(result, null, 2)

  await fs.writeFile(outputPath, json)

  console.log(`✅ Remote files from "${url}" saved!`)
}
