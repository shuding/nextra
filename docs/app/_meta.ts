export default {
  index: {
    type: 'page',
    display: 'hidden'
  },
  docs: {
    type: 'page',
    title: 'Documentation'
  },
  about: {
    type: 'page',
    theme: {
      typesetting: 'article'
    }
  },
  showcase: {
    type: 'page',
    theme: {
      typesetting: 'article',
      layout: 'full',
      timestamp: false
    }
  },
  sponsors: {
    type: 'page',
    title: 'Sponsors',
    theme: {
      typesetting: 'article',
      timestamp: false
    }
  },
  versions: {
    type: 'menu',
    title: 'Versions',
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
