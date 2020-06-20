import userConfig from '../nextra.config'

const defaultConfig = {
  nextLinks: true,
  prevLinks: true,
  search: true
}

export default () => {
  return { ...defaultConfig, ...userConfig }
}
