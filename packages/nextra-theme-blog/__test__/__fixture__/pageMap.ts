import { BlogPageOpts } from '../../src'

export const indexOpts: BlogPageOpts = {
  filePath: 'index.mdx',
  route: '/',
  frontMatter: {
    type: 'page',
    title: 'About',
    date: '2020-01-01T00:00:00.000Z'
  },
  pageMap: [
    {
      kind: 'MdxPage',
      name: 'index',
      route: '/',
      locale: '',
      frontMatter: {
        type: 'page',
        title: 'About',
        date: '2020-01-01T00:00:00.000Z'
      }
    },
    {
      kind: 'Folder',
      name: 'posts',
      children: [
        {
          kind: 'MdxPage',
          name: 'aaron-swartz-a-programmable-web',
          route: '/posts/aaron-swartz-a-programmable-web',
          locale: '',
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
          kind: 'MdxPage',
          name: 'index',
          route: '/posts',
          locale: '',
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
      kind: 'Folder',
      name: 'tags',
      children: [
        {
          kind: 'MdxPage',
          name: '[tag]',
          route: '/tags/[tag]',
          locale: '',
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
      type: 'heading',
      depth: 1,
      children: [
        {
          type: 'text',
          value: 'Nextra',
          position: {
            start: {
              line: 2,
              column: 3,
              offset: 3
            },
            end: {
              line: 2,
              column: 9,
              offset: 9
            }
          }
        }
      ],
      position: {
        start: {
          line: 2,
          column: 1,
          offset: 1
        },
        end: {
          line: 2,
          column: 9,
          offset: 9
        }
      },
      value: 'Nextra'
    }
  ]
}

export const postsOpts: BlogPageOpts = {
  filePath: 'index.md',
  route: '/posts',
  frontMatter: {
    type: 'posts',
    title: 'Random Thoughts',
    date: '2020-01-03T00:00:00.000Z'
  },
  pageMap: [
    {
      kind: 'MdxPage',
      name: 'index',
      route: '/',
      locale: '',
      frontMatter: {
        type: 'page',
        title: 'About',
        date: '2020-01-01T00:00:00.000Z'
      }
    },
    {
      kind: 'Folder',
      name: 'posts',
      children: [
        {
          kind: 'MdxPage',
          name: 'aaron-swartz-a-programmable-web',
          route: '/posts/aaron-swartz-a-programmable-web',
          locale: '',
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
          kind: 'MdxPage',
          name: 'index',
          route: '/posts',
          locale: '',
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
      kind: 'Folder',
      name: 'tags',
      children: [
        {
          kind: 'MdxPage',
          name: '[tag]',
          route: '/tags/[tag]',
          locale: '',
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
      type: 'heading',
      depth: 1,
      children: [
        {
          type: 'text',
          value: 'Random Thoughts',
          position: {
            start: {
              line: 2,
              column: 3,
              offset: 3
            },
            end: {
              line: 2,
              column: 18,
              offset: 18
            }
          }
        }
      ],
      position: {
        start: {
          line: 2,
          column: 1,
          offset: 1
        },
        end: {
          line: 2,
          column: 18,
          offset: 18
        }
      },
      value: 'Random Thoughts'
    }
  ]
}

export const articleOpts: BlogPageOpts = {
  filePath: 'aaron-swartz-a-programmable-web.mdx',
  route: '/posts/aaron-swartz-a-programmable-web',
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
      kind: 'MdxPage',
      name: 'index',
      route: '/',
      locale: '',
      frontMatter: {
        type: 'page',
        title: 'About',
        date: '2020-01-01T00:00:00.000Z'
      }
    },
    {
      kind: 'Folder',
      name: 'posts',
      children: [
        {
          kind: 'MdxPage',
          name: 'aaron-swartz-a-programmable-web',
          route: '/posts/aaron-swartz-a-programmable-web',
          locale: '',
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
          kind: 'MdxPage',
          name: 'index',
          route: '/posts',
          locale: '',
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
      kind: 'Folder',
      name: 'tags',
      children: [
        {
          kind: 'MdxPage',
          name: '[tag]',
          route: '/tags/[tag]',
          locale: '',
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
      type: 'heading',
      depth: 1,
      children: [
        {
          type: 'text',
          value: 'Notes on A Programmable Web by Aaron Swartz',
          position: {
            start: {
              line: 2,
              column: 3,
              offset: 3
            },
            end: {
              line: 2,
              column: 46,
              offset: 46
            }
          }
        }
      ],
      position: {
        start: {
          line: 2,
          column: 1,
          offset: 1
        },
        end: {
          line: 2,
          column: 46,
          offset: 46
        }
      },
      value: 'Notes on A Programmable Web by Aaron Swartz'
    },
    {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'Quotes About WWW',
          position: {
            start: {
              line: 17,
              column: 4,
              offset: 874
            },
            end: {
              line: 17,
              column: 20,
              offset: 890
            }
          }
        }
      ],
      position: {
        start: {
          line: 17,
          column: 1,
          offset: 871
        },
        end: {
          line: 17,
          column: 20,
          offset: 890
        }
      },
      value: 'Quotes About WWW'
    },
    {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'Quotes from Aaron’s Post',
          position: {
            start: {
              line: 23,
              column: 4,
              offset: 1559
            },
            end: {
              line: 23,
              column: 28,
              offset: 1583
            }
          }
        }
      ],
      position: {
        start: {
          line: 23,
          column: 1,
          offset: 1556
        },
        end: {
          line: 23,
          column: 28,
          offset: 1583
        }
      },
      value: 'Quotes from Aaron’s Post'
    },
    {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'External links',
          position: {
            start: {
              line: 63,
              column: 4,
              offset: 4179
            },
            end: {
              line: 63,
              column: 18,
              offset: 4193
            }
          }
        }
      ],
      position: {
        start: {
          line: 63,
          column: 1,
          offset: 4176
        },
        end: {
          line: 63,
          column: 18,
          offset: 4193
        }
      },
      value: 'External links'
    }
  ]
}

export const config = {
  readMore: 'Read More →',
  darkMode: true
}
