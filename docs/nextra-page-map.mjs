import docs_meta from "./docs/_meta.ts";
import docs_docs_meta from "./docs/docs/_meta.ts";
import docs_docs_blog_theme_meta from "./docs/docs/blog-theme/_meta.ts";
import docs_docs_docs_theme_meta from "./docs/docs/docs-theme/_meta.ts";
import docs_docs_docs_theme_api_meta from "./docs/docs/docs-theme/api/_meta.ts";
import docs_docs_guide_meta from "./docs/docs/guide/_meta.ts";
import docs_docs_guide_advanced_meta from "./docs/docs/guide/advanced/_meta.ts";
import docs_docs_guide_built_ins_meta from "./docs/docs/guide/built-ins/_meta.ts";
export const pageMap = [{
  data: docs_meta
}, {
  name: "404",
  route: "/404",
  frontMatter: {
    "sidebarTitle": "404"
  }
}, {
  name: "about",
  route: "/about",
  frontMatter: {
    "sidebarTitle": "About"
  }
}, {
  name: "docs",
  route: "/docs",
  children: [{
    data: docs_docs_meta
  }, {
    name: "blog-theme",
    route: "/docs/blog-theme",
    children: [{
      data: docs_docs_blog_theme_meta
    }, {
      name: "start",
      route: "/docs/blog-theme/start",
      frontMatter: {
        "sidebarTitle": "Start"
      }
    }]
  }, {
    name: "blog-theme",
    route: "/docs/blog-theme",
    frontMatter: {
      "sidebarTitle": "Blog Theme"
    }
  }, {
    name: "custom-theme",
    route: "/docs/custom-theme",
    frontMatter: {
      "sidebarTitle": "Custom Theme"
    }
  }, {
    name: "docs-theme",
    route: "/docs/docs-theme",
    children: [{
      data: docs_docs_docs_theme_meta
    }, {
      name: "api",
      route: "/docs/docs-theme/api",
      children: [{
        data: docs_docs_docs_theme_api_meta
      }, {
        name: "use-config",
        route: "/docs/docs-theme/api/use-config",
        frontMatter: {
          "sidebarTitle": "Use Config"
        }
      }]
    }, {
      name: "built-ins",
      route: "/docs/docs-theme/built-ins",
      children: [{
        name: "bleed",
        route: "/docs/docs-theme/built-ins/bleed",
        frontMatter: {
          "sidebarTitle": "Bleed"
        }
      }]
    }, {
      name: "built-ins",
      route: "/docs/docs-theme/built-ins",
      frontMatter: {
        "sidebarTitle": "Built Ins"
      }
    }, {
      name: "page-configuration",
      route: "/docs/docs-theme/page-configuration",
      frontMatter: {
        "sidebarTitle": "Page Configuration"
      }
    }, {
      name: "start",
      route: "/docs/docs-theme/start",
      frontMatter: {
        "sidebarTitle": "Start"
      }
    }, {
      name: "theme-configuration",
      route: "/docs/docs-theme/theme-configuration",
      frontMatter: {
        "sidebarTitle": "Theme Configuration"
      }
    }]
  }, {
    name: "docs-theme",
    route: "/docs/docs-theme",
    frontMatter: {
      "sidebarTitle": "Docs Theme"
    }
  }, {
    name: "guide",
    route: "/docs/guide",
    children: [{
      data: docs_docs_guide_meta
    }, {
      name: "advanced",
      route: "/docs/guide/advanced",
      children: [{
        data: docs_docs_guide_advanced_meta
      }, {
        name: "latex",
        route: "/docs/guide/advanced/latex",
        frontMatter: {
          "sidebarTitle": "Latex"
        }
      }, {
        name: "mermaid",
        route: "/docs/guide/advanced/mermaid",
        frontMatter: {
          "sidebarTitle": "Mermaid"
        }
      }, {
        name: "npm2yarn",
        route: "/docs/guide/advanced/npm2yarn",
        frontMatter: {
          "sidebarTitle": "Npm2yarn"
        }
      }, {
        name: "remote",
        route: "/docs/guide/advanced/remote",
        frontMatter: {
          "sidebarTitle": "Remote"
        }
      }, {
        name: "table",
        route: "/docs/guide/advanced/table",
        frontMatter: {
          "sidebarTitle": "Table"
        }
      }, {
        name: "tailwind-css",
        route: "/docs/guide/advanced/tailwind-css",
        frontMatter: {
          "sidebarTitle": "Tailwind CSS"
        }
      }, {
        name: "typescript",
        route: "/docs/guide/advanced/typescript",
        frontMatter: {
          "sidebarTitle": "TypeScript"
        }
      }]
    }, {
      name: "advanced",
      route: "/docs/guide/advanced",
      frontMatter: {
        "sidebarTitle": "Advanced"
      }
    }, {
      name: "built-ins",
      route: "/docs/guide/built-ins",
      children: [{
        data: docs_docs_guide_built_ins_meta
      }, {
        name: "callout",
        route: "/docs/guide/built-ins/callout",
        frontMatter: {
          "sidebarTitle": "Callout"
        }
      }, {
        name: "cards",
        route: "/docs/guide/built-ins/cards",
        frontMatter: {
          "sidebarTitle": "Cards"
        }
      }, {
        name: "filetree",
        route: "/docs/guide/built-ins/filetree",
        frontMatter: {
          "sidebarTitle": "Filetree"
        }
      }, {
        name: "steps",
        route: "/docs/guide/built-ins/steps",
        frontMatter: {
          "sidebarTitle": "Steps"
        }
      }, {
        name: "tabs",
        route: "/docs/guide/built-ins/tabs",
        frontMatter: {
          "sidebarTitle": "Tabs"
        }
      }]
    }, {
      name: "built-ins",
      route: "/docs/guide/built-ins",
      frontMatter: {
        "sidebarTitle": "Built Ins"
      }
    }, {
      name: "custom-css",
      route: "/docs/guide/custom-css",
      frontMatter: {
        "sidebarTitle": "Custom CSS"
      }
    }, {
      name: "i18n",
      route: "/docs/guide/i18n",
      frontMatter: {
        "sidebarTitle": "I18n"
      }
    }, {
      name: "image",
      route: "/docs/guide/image",
      frontMatter: {
        "sidebarTitle": "Image"
      }
    }, {
      name: "link",
      route: "/docs/guide/link",
      frontMatter: {
        "sidebarTitle": "Link"
      }
    }, {
      name: "markdown",
      route: "/docs/guide/markdown",
      frontMatter: {
        "sidebarTitle": "Markdown"
      }
    }, {
      name: "organize-files",
      route: "/docs/guide/organize-files",
      frontMatter: {
        "sidebarTitle": "Organize Files"
      }
    }, {
      name: "ssg",
      route: "/docs/guide/ssg",
      frontMatter: {
        "sidebarTitle": "Ssg"
      }
    }, {
      name: "syntax-highlighting",
      route: "/docs/guide/syntax-highlighting",
      frontMatter: {
        "sidebarTitle": "Syntax Highlighting"
      }
    }]
  }, {
    name: "guide",
    route: "/docs/guide",
    frontMatter: {
      "sidebarTitle": "Guide"
    }
  }, {
    name: "index",
    route: "/docs",
    frontMatter: {
      "sidebarTitle": "Index"
    }
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "sidebarTitle": "Index"
  }
}, {
  name: "showcase",
  route: "/showcase",
  frontMatter: {
    "sidebarTitle": "Showcase"
  }
}];