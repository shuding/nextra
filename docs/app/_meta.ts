export default {
  index: {
    type: 'page',
    display: 'hidden'
  },
  docs: {
    type: 'page',
    title: 'Documentation'
  },
  showcase: {
    type: 'page',
    theme: {
      typesetting: 'article',
      layout: 'full'
    }
  },
  about: {
    type: 'page',
    theme: {
      typesetting: 'article'
    }
  },
  version: {
    type: 'menu',
    title: 'Version',
    items: {
      2: {
        title: 'Nextra v2 Docs ↗',
        href: 'https://nextra-v2-oe0zrpzjp-shud.vercel.app',
        newWindow: true
      }
    }
  }
}
