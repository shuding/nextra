import { createCatchAllMeta } from 'nextra/catch-all'
import json from '../../../../../nextra-remote-filepaths/graphql-yoga.json'

export default () => {
  return createCatchAllMeta(json.filePaths, json.nestedMeta)
}
