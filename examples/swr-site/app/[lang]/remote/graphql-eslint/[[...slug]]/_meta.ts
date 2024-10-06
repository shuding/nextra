import { createCatchAllMeta } from 'nextra/catch-all'
import json from '../../../../../nextra-remote-filepaths/graphql-eslint.json'

export default () => createCatchAllMeta(json.filePaths, json.nestedMeta)
