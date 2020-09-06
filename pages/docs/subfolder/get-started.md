# Get Started

It has never been easier to create the routes and organize the sidebar structure!

```js
// next.config.js
const withNextra = require('nextra')('nextra-theme-docs', './theme.config.js')
module.exports = withNextra()
```

```jsx
// theme.config.js
export default {
  github: 'https://github.com/shuding/nextra',
  titleSuffix: ' – Nextra',
  logo: (
    <>
      <span className="mr-2 font-extrabold hidden md:inline">Nextra</span>
      <span className="text-gray-600 font-normal hidden md:inline">
        The Next Site Builder
      </span>
    </>
  ),
  head: () => (
    <>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="Nextra: the next site builder" />
      <meta name="og:description" content="Nextra: the next site builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta name="og:title" content="Nextra: the next site builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </>
  )
}
```
