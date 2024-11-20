import { fetchFilePathsFromGitHub } from 'nextra/fetch-filepaths-from-github'

fetchFilePathsFromGitHub({
  user: 'dotansimha',
  repo: 'graphql-yoga',
  // last commit with v2 source docs
  branch: '291daaaf3921b2ab875d988b7a7880ee277f247e',
  docsPath: 'website/src/pages/v2/',
  outputPath: './nextra-remote-filepaths/graphql-yoga.json'
})

fetchFilePathsFromGitHub({
  user: 'B2o5T',
  repo: 'graphql-eslint',
  branch: '34b722a2a520599ce06a4ddcccc9623b76434089',
  docsPath: 'website/src/pages/docs/',
  outputPath: './nextra-remote-filepaths/graphql-eslint.json'
})
