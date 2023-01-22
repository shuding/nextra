/* eslint-disable */
const path = require('path')
const fs = require('fs')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const CACHE_DIR = '.next/cache/nextra-remote/'

async function listFiles({ repo, rootDir }) {
  const dir = path.join(CACHE_DIR, repo.split('/').pop())
  await git.clone({ fs, http, dir, url: repo })

  const filenames = await git.listFiles({ fs, http, dir })
  return filenames
    .filter(filename => filename.startsWith(rootDir))
    .map(filename => filename.replace(rootDir, ''))
}

async function findPathWithExtension({ repo, rootDir, slug = ['index'] }) {
  const dirs = slug.slice(0, -1)
  const dirPath = path.join(CACHE_DIR, repo.split('/').pop(), rootDir, ...dirs)

  const files = await fs.promises.readdir(dirPath, {
    withFileTypes: true
  })
  const filename = slug.at(-1)
  const matched = files.find(file => {
    const { name, ext } = path.parse(file.name)
    return file.isFile() && name === filename && /\.mdx?$/.test(ext)
  })
  return path.join(dirPath, matched?.name)
}

async function findStaticPaths({ repo, rootDir }) {
  const filePaths = await listFiles({ repo, rootDir })
  return filePaths
    .filter(filename => /\.mdx?$/.test(filename))
    .map(filename => ({
      params: {
        slug: filename
          .replace(/\.mdx?$/, '')
          // .replace(/(\/|^)index$/, '')
          .split('/')
      }
    }))
}

module.exports = { listFiles, findPathWithExtension, findStaticPaths }
