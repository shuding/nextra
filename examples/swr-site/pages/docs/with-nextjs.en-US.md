import { Callout } from 'nextra/components'

# Usage with Next.js

## Client Side Data Fetching

If your page contains frequently updating data, and you don’t need to pre-render
the data, SWR is a perfect fit and no special setup needed: just import `useSWR`
and use the hook inside any components that use the data.

Here’s how it works:

- First, immediately show the page without data. You can show loading states for
  missing data.
- Then, fetch the data on the client side and display it when ready.

This approach works well for user dashboard pages, for example. Because a
dashboard is a private, user-specific page, SEO is not relevant and the page
doesn’t need to be pre-rendered. The data is frequently updated, which requires
request-time data fetching.

## Pre-rendering with Default Data

If the page must be pre-rendered, Next.js supports
[2 forms of pre-rendering](https://nextjs.org/docs/basic-features/data-fetching):  
**Static Generation (SSG)** and **Server-side Rendering (SSR)**.

Together with SWR, you can pre-render the page for SEO, and also have features
such as caching, revalidation, focus tracking, refetching on interval on the
client side.

You can use the `fallback` option of [`SWRConfig`](/docs/global-configuration)
to pass the pre-fetched data as the initial value of all SWR hooks. For example
with `getStaticProps`:

```jsx
export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.
  const article = await getArticleFromAPI()
  return {
    props: {
      fallback: {
        '/api/article': article
      }
    }
  }
}

function Article() {
  // `data` will always be available as it's in `fallback`.
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

The page is still pre-rendered. It's SEO friendly, fast to response, but also
fully powered by SWR on the client side. The data can be dynamic and
self-updated over time.

<Callout emoji="💡">
  The `Article` component will render the pre-generated data first, and after the page is hydrated, it will fetch the latest data again to keep it refresh.
</Callout>
