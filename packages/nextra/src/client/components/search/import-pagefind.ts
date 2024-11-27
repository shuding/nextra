'use no memo'

import { addBasePath } from 'next/dist/client/add-base-path'

// Fix React Compiler (BuildHIR::lowerExpression) Handle Import expressions (82:82)
export async function importPagefind() {
  window.pagefind = await import(
    /* webpackIgnore: true */ addBasePath('/_pagefind/pagefind.js')
  )
  await window.pagefind.options({
    baseUrl: '/'
    // ... more search options
  })
}
