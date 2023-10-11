export default () => {
  return {
    '*': {
      display: 'hidden',
      theme: {
        breadcrumb: false,
        footer: false,
        navbar: false,
        pagination: false,
        sidebar: false,
        timestamp: false,
        toc: false
      }
    }
  }
}
