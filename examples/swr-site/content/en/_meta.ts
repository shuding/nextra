export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      typesetting: 'article'
    }
  },
  docs: {
    type: 'page',
    title: 'Documentation'
  },
  about: {
    type: 'menu',
    title: 'About',
    items: {
      contributors: {
        title: 'Contributors',
        href: 'https://github.com/vercel/swr/graphs/contributors',
        newWindow: true
      },
      team: { title: 'Team' },
      acknowledgement: { title: 'Acknowledgement' },
      'a-page': { title: 'A Page' },
      changelog: { title: 'Changelog' }
    }
  },
  examples: {
    type: 'page',
    title: 'Examples',
    theme: {
      layout: 'full'
    }
  },
  blog: {
    type: 'page',
    title: 'Blog',
    theme: {
      sidebar: false,
      typesetting: 'article'
    }
  },
  nextra_link: {
    type: 'page',
    title: 'Nextra',
    href: 'https://github.com/shuding/nextra',
    newWindow: true
  }
}
