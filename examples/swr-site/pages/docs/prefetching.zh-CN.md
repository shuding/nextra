# 预请求数据

## 顶级页面数据

有很多方法可以为 SWR 预请求数据。对于顶级请求，强烈推荐 [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

只需把它放在HTML的 `<head>` 里即可。简单、快速、原生。

它将在 HTML 加载时预请求数据，甚至是在 JavaScript 开始下载之前。使用相同 URL 的所有传入 fetch 请求都将重用结果(当然包括SWR)。

## 手动预请求

有时，你想有条件地预加载资源。比如当用户 [hovering](https://github.com/GoogleChromeLabs/quicklink) [a](https://github.com/guess-js/guess) [link](https://instant.page) 时预加载数据。最直观的方法就是用全局的 [mutate](/docs/mutation) 重新请求和设置缓存：

另一个选择是有条件地预请求数据。你可以通过 [mutate](/docs/mutation) 来重新请求以及设置缓存：

```js
import { mutate } from 'swr'

function prefetch () {
  mutate('/api/data', fetch('/api/data').then(res => res.json()))
  // 第二个参数是个 Promise
  // SWR 将在解析时使用结果
}
```

配合 Next.js 的 [页面预加载](https://nextjs.org/docs/api-reference/next/router#routerprefetch)，你将能立即加载下一页和数据。

## 数据预填充

如果你想在 SWR 缓存中预填充已经存在的数据，你可以使用 `fallbackData` 选项，例如：

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

当 SWR 还没有获取此次数据的时候， 这个 hook 将返回 `prefetchedData` 作为 fallback 。 

你也可以为所有的 SWR hooks 和不同的 key 配置 `<SWRConfig>` 和它的 `fallback` 选项。 查看 [Next.js SSG 和 SSR](/docs/with-nextjs) 了解更多详细信息。
