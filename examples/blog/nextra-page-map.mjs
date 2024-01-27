export const pageMap = [{
  name: "page",
  route: "/page",
  frontMatter: {
    "sidebarTitle": "Page",
    "title": "About"
  }
}, {
  name: "posts",
  route: "/posts",
  children: [{
    name: "(with-comments)",
    route: "/posts/(with-comments)",
    children: [{
      name: "aaron-swartz-a-programmable-web",
      route: "/posts/(with-comments)/aaron-swartz-a-programmable-web",
      children: [{
        name: "page",
        route: "/posts/(with-comments)/aaron-swartz-a-programmable-web/page",
        frontMatter: {
          "sidebarTitle": "Page",
          "title": "Notes on A Programmable Web by Aaron Swartz",
          "date": new Date(1463788800000),
          "description": "At the time when I was getting into web development, I had the chance to read one of the most inspiring book about the web, Aaron Swartz's A Programmable Web. And it completely changed my mind.",
          "tags": ["web development"],
          "author": "Shu"
        }
      }]
    }, {
      name: "code-blocks",
      route: "/posts/(with-comments)/code-blocks",
      children: [{
        name: "page",
        route: "/posts/(with-comments)/code-blocks/page",
        frontMatter: {
          "sidebarTitle": "Page",
          "title": "Code blocks",
          "date": new Date(1659052800000),
          "description": "En example of using code blocks in your blog.",
          "tags": ["web development", "JavaScript", "GraphQL", "C++", "Java", "React", "Next.js", "The Guild", "MacBook Pro"],
          "author": "Dimitri POSTOLOV"
        }
      }]
    }, {
      name: "draft",
      route: "/posts/(with-comments)/draft",
      children: [{
        name: "page",
        route: "/posts/(with-comments)/draft/page",
        frontMatter: {
          "sidebarTitle": "Page",
          "title": "Draft",
          "date": new Date(1687910400000),
          "description": "An example of a draft post.",
          "draft": true,
          "tags": ["web development"],
          "author": "Ada Lovelace"
        }
      }]
    }, {
      name: "nextra-components",
      route: "/posts/(with-comments)/nextra-components",
      children: [{
        name: "page",
        route: "/posts/(with-comments)/nextra-components/page",
        frontMatter: {
          "sidebarTitle": "Page",
          "title": "Nextra Components",
          "date": new Date(1684108800000),
          "description": "En example of using the Callout component in your blog.",
          "tags": ["web development"],
          "author": "Tristan Dubbeld"
        }
      }]
    }, {
      name: "table",
      route: "/posts/(with-comments)/table",
      children: [{
        name: "page",
        route: "/posts/(with-comments)/table/page",
        frontMatter: {
          "sidebarTitle": "Page",
          "title": "Table",
          "date": new Date(1661644800000),
          "description": "En example of using table.",
          "tags": ["web development"],
          "author": "Dimitri POSTOLOV"
        }
      }]
    }]
  }]
}, {
  name: "tags",
  route: "/tags",
  children: []
}];