/* eslint-disable */

// This file has to be targeted to CJS, to keep `require.resolve` untranspiled.
// Otherwise, the file tracing will not work.

const fs = require('fs')
const path = require('path')

// https://github.com/shuding/nextra/pull/1168#issuecomment-1374960179
// Make sure to include all languages in the bundle when tracing dependencies.
// @ts-ignore
const shikiPath = require.resolve('shiki/package.json')
fs.readdir(path.join(shikiPath, '..', 'languages'), () => {})

const katexPath = require.resolve('katex/package.json')
fs.readdir(path.join(katexPath, '..', 'dist'), () => {})
