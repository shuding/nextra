import userConfig from '../theme.config'

const defaultConfig = {
  nextLinks: true,
  prevLinks: true,
  search: true
}

export default () => {
  return { ...defaultConfig, ...userConfig }
}
