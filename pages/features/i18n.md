# I18n

Nextra supports [Next.js i18n](https://nextjs.org/docs/advanced-features/i18n-routing) out of the box.

To add multi-language pages to your Nextra application, just need to config `i18n` in `next.config.js`:

```js
// next.config.js
const withNextra = require('nextra')('nextra-theme-docs', './theme.config.js')
module.exports = withNextra({
  i18n: {
    locales: ['en', 'zh', 'de'],
    defaultLocale: 'en',
  },
})
```

And then, add the locale to your files as the extension (same for the default locale):

```
/pages
  index.en.md
  index.zh.md
  index.de.md
  meta.en.json
  meta.zh.json
  meta.de.json
  ...
```

Finally, add the `i18n` option to your `theme.config.js` so the theme will show the dropdown menu:

```jsx
i18n: [
  { locale: 'en', text: 'English' },
  { locale: 'zh', text: '中文' },
  { locale: 'de', text: 'Deutsch' },
  { locale: 'ar', text: 'العربية', direction: 'rtl' },
]
```
