import { Callout } from 'nextra-theme-docs'

# 配合 Next.js 使用

## 客户端数据请求

如果你的页面包含频繁更新的数据，并且你不需要预渲染数据，那么 SWR 是一个完美选择，而且不需要特别配置：只需要引入 `useSWR`，并在使用该数据的任意组件中使用该 hook 即可。

工作原理：

- 首先，立即显示没有数据的空页面。也可以显示加载进度条。
- 然后，在客户端请求数据并在准备就绪时渲染数据。

这种方法适用于登录后的页面（控制面板）等。因为登录后的页面是一个私有的、特定于用户的页面，与 SEO 无关，页面也不需要预渲染。数据经常更新，这需要即时数据加载。

## 使用默认数据进行预渲染

如果页面必须进行预渲染, Next.js 支持 [两种形式](https://nextjs.org/docs/basic-features/data-fetching)： **静态生成 (SSG)** 和 **服务器渲染 (SSR)**。

与 SWR 一起使用，你可以通过预渲染页面来获得 SEO , 并且还可以拥有缓存，重新验证，焦点跟踪，客户端周期性请求数据的功能。

你可以使用 [`SWRConfig`](/docs/global-configuration) 的 `fallback` 选项将预先请求的数据作为所有 SWR hooks 的初始值传递。
例如使用 `getStaticProps` :

```jsx
 export async function getStaticProps () {
  // `getStaticProps` 在服务器端执行。
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
  // `data` 将始终是可用的。因为它在`fallback`中。
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  // 被`SWRConfig` 所包裹的 SWR hooks 将能够使用这些值。
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

该页面仍然是预渲染的。 它对 SEO 友好，并能够快速的响应。同时在客户端方面获得了来自 SWR 的完全支持。随着时间的推移，窗口中的数据将持续是动态且自我更新的。

<Callout emoji="💡">
  `Article` 组件会先渲染预先生成的数据，并且在页面 hydrate 后，它将再次获取最新数据，以保持数据的时效性。
</Callout>
