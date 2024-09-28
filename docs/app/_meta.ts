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
      _3: {
        title: 'Nextra v3 Docs ↗',
        href: 'https://nextra-v2-pyibc76cq-shud.vercel.app',
        newWindow: true
      },
      _2: {
        title: 'Nextra v2 Docs ↗',
        href: 'https://nextra-v2-oe0zrpzjp-shud.vercel.app',
        newWindow: true
      }
    }
  }
}
