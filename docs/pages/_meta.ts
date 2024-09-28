export default {
  index: {
    type: 'page',
    title: 'Nextra',
    display: 'hidden',
    theme: {
      layout: 'raw'
    }
  },
  docs: {
    type: 'page',
    title: 'Documentation'
  },
  showcase: {
    type: 'page',
    title: 'Showcase',
    theme: {
      typesetting: 'article',
      layout: 'full'
    }
  },
  about: {
    type: 'page',
    title: 'About',
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
  },
  '404': {
    type: 'page',
    theme: {
      timestamp: false,
      typesetting: 'article'
    }
  }
}
