import { createCatchAllMeta } from 'nextra/page-map'
import json from '../../../../../nextra-remote-filepaths/graphql-eslint.json'

export default () => createCatchAllMeta(json.filePaths, json.nestedMeta)
