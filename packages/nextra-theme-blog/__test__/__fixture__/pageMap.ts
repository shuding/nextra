import type { BlogPageOpts } from '../../src'

export const indexOpts: BlogPageOpts = {
  filePath: 'index.mdx',
  frontMatter: {
    type: 'page',
    title: 'About',
    date: '2020-01-01T00:00:00.000Z'
  },
  pageMap: [
    {
      name: 'index',
      route: '/',
      frontMatter: {
        type: 'page',
        title: 'About',
        date: '2020-01-01T00:00:00.000Z'
      }
    },
    {
      name: 'posts',
      children: [
        {
          name: 'aaron-swartz-a-programmable-web',
          route: '/posts/aaron-swartz-a-programmable-web',
          frontMatter: {
            title: 'Notes on A Programmable Web by Aaron Swartz',
            date: '2016/5/21',
            description:
              "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
            tag: 'web development',
            author: 'Shu'
          }
        },
        {
          name: 'index',
          route: '/posts',
          frontMatter: {
            type: 'posts',
            title: 'Random Thoughts',
            date: '2020-01-03T00:00:00.000Z'
          }
        }
      ],
      route: '/posts'
    },
    {
      name: 'tags',
      children: [
        {
          name: '[tag]',
          route: '/tags/[tag]',
          frontMatter: {
            type: 'tag'
          }
        }
      ],
      route: '/tags'
    }
  ],
  title: 'Nextra',
  headings: [
    {
      depth: 1,
      value: 'Nextra',
      id: 'nextra'
    }
  ]
}

export const postsOpts: BlogPageOpts = {
  filePath: 'index.md',
  frontMatter: {
    type: 'posts',
    title: 'Random Thoughts',
    date: '2020-01-03T00:00:00.000Z'
  },
  pageMap: [
    {
      name: 'index',
      route: '/',
      frontMatter: {
        type: 'page',
        title: 'About',
        date: '2020-01-01T00:00:00.000Z'
      }
    },
    {
      name: 'posts',
      children: [
        {
          name: 'aaron-swartz-a-programmable-web',
          route: '/posts/aaron-swartz-a-programmable-web',
          frontMatter: {
            title: 'Notes on A Programmable Web by Aaron Swartz',
            date: '2016/5/21',
            description:
              "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
            tag: 'web development',
            author: 'Shu'
          }
        },
        {
          name: 'index',
          route: '/posts',
          frontMatter: {
            type: 'posts',
            title: 'Random Thoughts',
            date: '2020-01-03T00:00:00.000Z'
          }
        }
      ],
      route: '/posts'
    },
    {
      name: 'tags',
      children: [
        {
          name: '[tag]',
          route: '/tags/[tag]',
          frontMatter: {
            type: 'tag'
          }
        }
      ],
      route: '/tags'
    }
  ],
  title: 'Random Thoughts',
  headings: [
    {
      depth: 1,
      value: 'Random Thoughts',
      id: 'random-thoughts'
    }
  ]
}

export const articleOpts: BlogPageOpts = {
  filePath: 'aaron-swartz-a-programmable-web.mdx',
  frontMatter: {
    title: 'Notes on A Programmable Web by Aaron Swartz',
    date: '2016/5/21',
    description:
      "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
    tag: 'web development',
    author: 'Shu'
  },
  pageMap: [
    {
      name: 'index',
      route: '/',
      frontMatter: {
        type: 'page',
        title: 'About',
        date: '2020-01-01T00:00:00.000Z'
      }
    },
    {
      name: 'posts',
      children: [
        {
          name: 'aaron-swartz-a-programmable-web',
          route: '/posts/aaron-swartz-a-programmable-web',
          frontMatter: {
            title: 'Notes on A Programmable Web by Aaron Swartz',
            date: '2016/5/21',
            description:
              "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
            tag: 'web development',
            author: 'Shu'
          }
        },
        {
          name: 'index',
          route: '/posts',
          frontMatter: {
            type: 'posts',
            title: 'Random Thoughts',
            date: '2020-01-03T00:00:00.000Z'
          }
        }
      ],
      route: '/posts'
    },
    {
      name: 'tags',
      children: [
        {
          name: '[tag]',
          route: '/tags/[tag]',
          frontMatter: {
            type: 'tag'
          }
        }
      ],
      route: '/tags'
    }
  ],
  title: 'Notes on A Programmable Web by Aaron Swartz',
  headings: [
    {
      depth: 1,
      value: 'Notes on A Programmable Web by Aaron Swartz',
      id: 'notes-on-a-programmable-web-by-aaron-swartz'
    },
    {
      depth: 2,
      value: 'Quotes About WWW',
      id: 'quotes-about-www'
    },
    {
      depth: 2,
      value: 'Quotes from Aaron’s Post',
      id: 'quotes-from-aarons-post'
    },
    {
      depth: 2,
      value: 'External links',
      id: 'external-links'
    }
  ]
}

export const config = {
  readMore: 'Read More →',
  darkMode: true
}
