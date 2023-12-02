# Prefetching Data

## Top-Level Page Data

Hay muchas formas de precargar los datos para SWR. Para las solicitudes de nivel
superior,
[`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)
es muy recomendable:

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous" />
```

Sólo tienes que ponerlo dentro de tu HTML `<head>`. Es fácil, rápido y nativo.

Se precargarán los datos cuando se cargue el HTML, incluso antes de que el
JavaScript comience a descargarse. Todas las solicitudes de fetch entrantes con
la misma URL reutilizarán el resultado (incluyendo SWR, por supuesto).

## Programmatically Prefetch

A veces, se quiere precargar un recurso de forma condicional. Por ejemplo,
precargar los datos cuando el usuario está
[hovering](https://github.com/GoogleChromeLabs/quicklink)
[a](https://github.com/guess-js/guess) [link](https://instant.page). La forma
más intuitiva es tener una función que recupere y fije la caché a través de la
función global [mutate](/docs/mutation):

```js
import { mutate } from 'swr'

function prefetch() {
  mutate(
    '/api/data',
    fetch('/api/data').then(res => res.json())
  )
  // el segundo parametró es una Promise
  // SWR utilizará el resultado cuando resuelva
}
```

Junto con técnicas como
[page prefetching](https://nextjs.org/docs/api-reference/next/router#routerprefetch)
en Next.js, podrás cargar tanto la siguiente página como los datos al instante.

## Pre-fill Data

If you want to pre-fill existing data into the SWR cache, you can use the
`fallbackData` option. For example:

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

If SWR hasn't fetched the data yet, this hook will return `prefetchedData` as a
fallback.

You can also configure this for all SWR hooks and multiple keys with
`<SWRConfig>` and the `fallback` option. Check
[Next.js SSG and SSR](/docs/with-nextjs) for more details.
