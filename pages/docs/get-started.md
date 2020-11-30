# Get Started

It has never been easier to create the routes and organize the sidebar structure!

1. Install Next.js and React: `yarn add next react react-dom`

2. Install Nextra and the docs theme: `yarn add nextra nextra-theme-docs`

3. Create the following Next.js config and theme config under the root directory:

```jsx
// next.config.js
const withNextra = require('nextra')('nextra-theme-docs', './theme.config.js')
module.exports = withNextra()
```

```jsx
// theme.config.js
export default {
  github: 'https://github.com/shuding/nextra',     // link of the project repo
  siteGithub: 'https://github.com/shuding/nextra', // link of the docs repo path
  titleSuffix: ' – Nextra',
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null,                              // <- customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  footerText: 'MIT 2020 © Shu Ding.',
  footerEditOnGitHubLink: true,                    // will link to the docs repo
  logo: (
    <React.Fragment>
      <span className="mr-2 font-extrabold hidden md:inline">Nextra</span>
      <span className="text-gray-600 font-normal hidden md:inline">
        The Next Docs Builder
      </span>
    </React.Fragment>
  ),
  head: (
    <React.Fragment>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:description" content="Nextra: the next docs builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta name="og:title" content="Nextra: the next docs builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </React.Fragment>
  )
}
```

4. Create `pages/_app.js` and include the theme stylesheet:

```jsx
import 'nextra-theme-docs/style.css'

export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

5. You are good to go! Any `.md` or `.mdx` file will turn into a doc page and be displayed in sidebar. You can also create a `meta.json` file to customize the page order and title.

Check the source code: https://github.com/shuding/nextra
