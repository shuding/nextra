# `_meta.js` File

In Nextra, the site and individual page structure can be configured via the co-located `_meta` files. Those configurations affect the overall layout of your Nextra theme, especially the navigation bar and the sidebar:

![Example of Nextra Theme Docs](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frouting%401x.3f040172.png\&w=3840\&q=75)

Example: [Nextra Docs Theme](/docs/docs-theme) has sidebar and navbar generated automatically from Markdown files.

## Organizing files[](#organizing-files)

Nextra allows you to organize files in the following ways:

- **In Next.js’ [`app` directory](https://nextjs.org/docs/app/getting-started/project-structure#top-level-folders):**\
  Nextra gathers all `page` files, including [`page.md` and `page.mdx` files](/docs/file-conventions/page-file) as well as `_meta` files.

- **In Nextra’s [`content` directory](/docs/file-conventions/content-directory):**\
  Nextra collects all `.md` and `.mdx` files, along with `_meta` files.

Below the same file-based routing structure is represented for `content` and `app`-only directories:

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - about

    - \_meta.js
    - index.mdx
    - legal.md

  - \_meta.js

  - contact.md

  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - about

    - legal
    - \_meta.js
    - page.mdx

  - contact

  - \_meta.js

  - layout.jsx

  - page.mdx

**Note**

You can combine both organizational ways for your project:

- [x] the `content` directory with `.mdx` files
- [x] the `app` directory with `page` files

### `pageMap` structure[](#pagemap-structure)

Afterward, Nextra generates a `pageMap` array containing information about your entire site’s routes and directories structure. Features such as the navigation bar and sidebar can be generated based on the `pageMap` information.

The generated `pageMap` will be:

pageMap

```
[
  // content/_meta.js
  { "data": {} },
  {
    // content/index.mdx
    "name": "index",
    "route": "/",
    "title": "Index",
    "frontMatter": {}
  },
  {
    // content/contact.md
    "name": "contact",
    "route": "/contact",
    "title": "Contact",
    "frontMatter": {}
  },
  {
    // content/about
    "name": "about",
    "route": "/about",
    "title": "About",
    "children": [
      // content/about/_meta.js
      { "data": {} },
      {
        // content/about/index.mdx
        "name": "index",
        "route": "/about",
        "title": "Index",
        "frontMatter": {}
      },
      {
        // content/about/legal.md
        "name": "legal",
        "route": "/about/legal",
        "title": "Legal",
        "frontMatter": {}
      }
    ]
  }
]
```

And the global `pageMap` will be imported to each page by Nextra. Then, configured theme will render the actual UI with that `pageMap`.

## API[](#api)

The title and order of a page shown in the sidebar/navbar can be configured in the `_meta` file as key-value pairs.

\_meta.ts

```
import type { MetaRecord } from 'nextra'
 
/**
 * type MetaRecordValue =
 *  | TitleSchema
 *  | PageItemSchema
 *  | SeparatorSchema
 *  | MenuSchema
 *
 * type MetaRecord = Record<string, MetaRecordValue>
 **/
const meta: MetaRecord = {
  // ...
}
 
export default meta
```

### `title` type[](#title-type)

When specifying a `title` in `_meta` file, you can define it as either a simple string or a JSX element.

```
type TitleSchema = string | ReactElement
```

For the below file structure:

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - \_meta.js
  - about.mdx
  - contact.mdx
  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - about
  - contact
  - \_meta.js
  - layout.jsx
  - page.mdx

The following `_meta` file defines pages titles:

\_meta.jsx

```
import { GitHubIcon } from 'nextra/icons'
 
export default {
  index: 'My Homepage',
  // You can use JSX elements to change the look of titles in the sidebar, e.g. insert icons
  contact: (
    <Italic className="my-class">
      <GitHubIcon height="20" />
      Contact Us
    </Italic>
  ),
  about: {
    // Alternatively, you can set title with `title` property
    title: 'About Us'
    // ... and provide extra configurations
  }
}
 
// Custom component for italicized text
function Italic({ children, ...props }) {
  return <i {...props}>{children}</i>
}
```

### Pages[](#pages)

In `_meta` file you can define how the pages are shown in the sidebar, e.g. for the following file structure:

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - \_meta.js
  - about.mdx
  - contact.mdx
  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - about
  - contact
  - \_meta.js
  - layout.jsx
  - page.mdx

\_meta.js

```
export default {
  index: 'My Homepage',
  contact: 'Contact Us',
  about: 'About Us'
}
```

**Note**

If any routes are not listed in the `_meta` file, they will be appended to the end of the sidebar and sorted alphabetically (except for `index` key which comes first if it’s not specified in `_meta` file).

```
type PageItemSchema = {
  type: 'page' | 'doc' // @default 'doc'
  display: 'normal' | 'hidden' | 'children' // @default 'normal'
  title?: TitleSchema
  theme?: PageThemeSchema
}
```

#### `type: 'page'` option[](#type-page-option)

By defining a top-level page or folder as `type: 'page'`, it will be shown as a special page on the navigation bar, instead of the sidebar. With this feature, you can have multiple “sub docs”, and special pages or links such as “Contact Us” that are always visible.

For example, you can have 2 docs folders `frameworks` and `fruits` in your project. In your top-level `_meta` file, you can set everything as a page, instead of a normal sidebar item:

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - frameworks

    - react.mdx
    - svelte.mdx
    - vue.mdx

  - fruits

    - apple.mdx
    - banana.mdx

  - \_meta.js

  - about.mdx

  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - about

  - frameworks

    - react
    - svelte
    - vue

  - fruits

    - apple
    - banana

  - \_meta.js

  - layout.jsx

  - page.mdx

\_meta.js

```
export default {
  index: {
    title: 'Home',
    type: 'page'
  },
  frameworks: {
    title: 'Frameworks',
    type: 'page'
  },
  fruits: {
    title: 'Fruits',
    type: 'page'
  },
  about: {
    title: 'About',
    type: 'page'
  }
}
```

And it will look like this:

[](/assets/docs/sub-docs.mp4)

[Live example on StackBlitz ](https://stackblitz.com/edit/nextra-2-docs-eszspq?file=pages%2F_meta.js)

**Tip**

You can also hide links like `Home` from the navbar with the [`display: 'hidden'`](#display-hidden-option) option.

You can have external links in the navbar, similar to the [links section](#links):

\_meta.js

```
export default {
  contact: {
    title: 'Contact Us',
    type: 'page',
    href: 'https://example.com/contact'
  }
}
```

#### `display: 'hidden'` option[](#display-hidden-option)

By default, all MDX routes in the filesystem will be shown on the sidebar. But you can hide a specific pages or folders by using the `display: 'hidden'` configuration:

\_meta.js

```
export default {
  contact: {
    display: 'hidden'
  }
}
```

**Note**

The page will still be accessible via the `/contact` URL, but it will not be shown in the sidebar.

#### `theme` option[](#theme-option)

You can configure the theme for each page using the `theme` option. For example, you can disable or enable specific components for specific pages:

\_meta.js

```
export default {
  about: {
    theme: {
      sidebar: false
    }
  }
}
```

**Warning**

This option will be inherited by all child pages if set to a folder.

| Name                          | Type                                                                    | Default     |
| ----------------------------- | ----------------------------------------------------------------------- | ----------- |
| [](#breadcrumb)`breadcrumb`   | `boolean`Show or hide breadcrumb navigation.                            | `true`      |
| [](#collapsed)`collapsed`     | `boolean`Indicates whether the item in sidebar is collapsed by default. | `false`     |
| [](#footer)`footer`           | `boolean`Specifies whether to display the footer.                       | `true`      |
| [](#layout)`layout`           | `"default,full"`Defines the layout style.                               | `'default'` |
| [](#navbar)`navbar`           | `boolean`Specifies whether to display the navbar.                       | `true`      |
| [](#pagination)`pagination`   | `boolean`Determines if pagination controls are shown.                   | `true`      |
| [](#sidebar)`sidebar`         | `boolean`Specifies whether to display the sidebar.                      | `true`      |
| [](#timestamp)`timestamp`     | `boolean`Indicates if “last updated” timestamps are displayed.          | `true`      |
| [](#toc)`toc`                 | `boolean`Determines whether a table of contents is displayed.           | `true`      |
| [](#typesetting)`typesetting` | `"default,article"`Configures the text typesetting style.               | `'default'` |

##### Layouts[](#layouts)

By default, each page has `layout: 'default'` in their theme config, which is the default behavior. You might want to render some page with the full container width and height, but keep all the other styles. You can use the `'full'` layout to do that:

\_meta.js

```
export default {
  about: {
    theme: {
      layout: 'full'
    }
  }
}
```

##### Typesetting[](#typesetting-section)

The `typesetting` option controls typesetting details like font features, heading styles and components like `<li>` and `<code>`. There are `'default'` and `'article'` typesettings available in the docs theme.

The default one is suitable for most cases like documentation, but you can use the `'article'` typesetting to make it look like an elegant article page:

\_meta.js

```
export default {
  about: {
    theme: {
      typesetting: 'article'
    }
  }
}
```

[Live example on StackBlitz ](https://stackblitz.com/edit/nextra-2-docs-hg77h3?file=pages%2F_meta.js,pages%2Findex.mdx)

### Folders[](#folders)

Folders can be configured in the same way as pages.

For example, the following top-level `_meta` file contains the meta information for the top-level pages and folders.\
The nested `_meta` file contains the meta information for pages in the same folder:

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - fruits

    - \_meta.js
    - apple.mdx
    - banana.mdx

  - \_meta.js

  - about.mdx

  - contact.mdx

  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - about

  - contact

  - fruits

    - apple
    - banana
    - \_meta.js

  - \_meta.js

  - layout.jsx

  - page.mdx

\_meta.js

```
export default {
  index: 'My Homepage',
  contact: 'Contact Us',
  fruits: 'Delicious Fruits',
  about: 'About Us'
}
```

fruits/\_meta.js

```
export default {
  apple: 'Apple',
  banana: 'Banana'
}
```

**Note**

You can move directories around without having to change the `_meta` file since information for pages are grouped together in directories.

#### With `/index` page[](#with-index-page)

To create a folder with an index page, add `asIndexPage: true` to its front matter.

For example, to create a `/fruits` route, setting `asIndexPage: true` tells Nextra that `/fruits` is a folder with an index page. Clicking the folder in the sidebar will expand it and display the MDX page.

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - fruits

    - \_meta.js
    - apple.mdx
    - banana.mdx
    - index.mdx

  - \_meta.js

  - about.mdx

  - contact.mdx

  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - about

  - contact

  - fruits

    - apple
    - banana
    - \_meta.js
    - page.mdx

  - \_meta.js

  - layout.jsx

  - page.mdx

content/fruits/index.mdx or app/fruits/page.mdx

```
---
title: All Fruits
sidebarTitle: 🍒 Fruits
asIndexPage: true
---
```

### Links[](#links)

```
type LinkSchema = {
  href: string
  title?: TitleSchema
}
```

You can add external links to the sidebar by adding an item with `href` in `_meta` file:

\_meta.js

```
export default {
  github_link: {
    title: 'Nextra',
    href: 'https://github.com/shuding/nextra'
  }
}
```

**Tip**

You can use this option to link to relative internal links too.

### Separators[](#separators)

```
type SeparatorSchema = {
  type: 'separator'
  title?: TitleSchema
}
```

You can use a “placeholder” item with `type: 'separator'` to create a separator line between items in the sidebar:

\_meta.js

```
export default {
  '###': {
    type: 'separator',
    title: 'My Items' // Title is optional
  }
}
```

### Menus[](#menus)

You can also add menus to the navbar using `type: 'menu'` and the `items` option:

![Navbar menu](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmenu.1a4a8a84.png\&w=3840\&q=75)

[Live example on StackBlitz ](https://stackblitz.com/edit/nextra-2-docs-2qopvp?file=pages%2F_meta.js)

```
type MenuItemSchema =
  | TitleSchema
  | { title: TitleSchema }
  | (LinkSchema & { type?: 'page' | 'doc' })
  | SeparatorSchema
 
type MenuSchema = {
  type: 'menu'
  title?: TitleSchema
  items: Record<string, MenuItemSchema>
}
```

\_meta.js

```
export default {
  company: {
    title: 'Company',
    type: 'menu',
    items: {
      about: {
        title: 'About',
        href: '/about'
      },
      contact: {
        title: 'Contact Us',
        href: 'mailto:hi@example.com'
      }
    }
  }
}
```

### Fallbacks[](#fallbacks)

In the [`type: 'page'` option](#type-page-option) above, we have to define the `type: 'page'` option for every page. To make it easier, you can use the `'*'` key to define the fallback configuration for all items in this folder:

\_meta.js

```
export default {
  '*': {
    type: 'page'
  },
  index: 'Home',
  frameworks: 'Frameworks',
  fruits: 'Fruits',
  about: 'About'
}
```

They are equivalent where all items have `type: 'page'` set.

### `_meta.global` file[](#_metaglobal-file)

You can also define all your pages in a single `_meta` file, suffixed with `.global`. The API remains the same as for folder-specific `_meta` files, with 1 exception: **folder items must include an `items` field**.

For the following structure, you might use the following `_meta` files:

- **Using [`content` directory](/docs/file-conventions/content-directory)**

  app

  - \[\[...mdxPath]]
  - layout.jsx

- content

  - fruits

    - \_meta.js
    - apple.mdx
    - banana.mdx

  - \_meta.js

  - index.mdx

* **Using [`page.mdx` files](/docs/file-conventions/page-file)**

  app

  - fruits

    - apple
    - banana
    - \_meta.js

  - \_meta.js

  - layout.jsx

  - page.mdx

\_meta.js

```
export default {
  fruits: {
    type: 'page',
    title: '✨ Fruits'
  }
}
```

fruits/\_meta.js

```
export default {
  apple: '🍎 Apple',
  banana: '🍌 BaNaNa'
}
```

With single `_meta.global` file it can be defined as below:

\_meta.global.js

```
export default {
  fruits: {
    type: 'page',
    title: '✨ Fruits',
    items: {
      apple: '🍎 Apple',
      banana: '🍌 BaNaNa'
    }
  }
}
```

**Warning**

You can’t use both `_meta.global` and `_meta` files in your project.

## Good to know[](#good-to-know)

### Sorting pages[](#sorting-pages)

You can use ESLint’s built-in `sort-keys` rule, append `/* eslint sort-keys: error */` comment at the top of your `_meta` file, and you will receive ESLint’s errors about incorrect order.

### Type of `_meta` keys[](#type-of-_meta-keys)

The type of your `_meta` keys should always **be a string** and **not a number** because [numbers are always ordered first ](https://dev.to/frehner/the-order-of-js-object-keys-458d) in JavaScript objects.

For example, consider the following:

\_meta.js

```
export default {
  foo: '',
  1992_10_21: '',
  1: ''
}
```

will be converted to:

\_meta.js

```
export default {
  '1': '',
  '19921021': '',
  foo: ''
}
```

**Tip**

The `.js`, `.jsx`, or `.tsx` file extensions can be used for `_meta` file.
