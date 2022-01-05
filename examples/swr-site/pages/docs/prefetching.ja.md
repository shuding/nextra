# データのプリフェッチ

## トップレベルのページデータ

SWR のデータをプリフェッチする方法はたくさんあります。トップレベルのリクエストでは、 [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) を強く推奨します。

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

HTMLの `<head>` の中に入れるだけです。簡単、速い、そしてネイティブです。

JavaScriptのダウンロードが開始される前であっても、HTMLの読み込み時にデータをプリフェッチします。同じ URL で受信したすべてのフェッチリクエストは、その結果を再利用します（もちろん、 SWR を含む）。

## プログラムによるプリフェッチ

しばしば、リソースを条件付きでプリロードしたい場合があります。たとえば、ユーザーが [hovering](https://github.com/GoogleChromeLabs/quicklink) [a](https://github.com/guess-js/guess) [link](https://instant.page) にカーソルを合わせたときにデータをプリロードするような場合です。最も直観的な方法は、グローバルミューテートを使ってキャッシュを再取得し、設定する関数を作成することです。

```js
import { mutate } from 'swr'

function prefetch () {
  mutate('/api/data', fetch('/api/data').then(res => res.json()))
  // 2番目のパラメータはPromise
  // SWRは、その結果を解決する際に使用します。
}
```

Next.js の [ページプリフェッチ](https://nextjs.org/docs/api-reference/next/router#routerprefetch) などの技術と合わせて、次のページとデータの両方を瞬時に読み込むことができるようになります。

## 事前データ

もし既に存在しているデータを SWR にキャッシュしたい場合は、 `fallbackData` オプションを使うことができます。たとえば：

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

もし SWR がまだデータを取得していない場合、このフックは初期値として `prefetchedData` を返します。

また `SWRConfig` と `fallback` オプションを使用して、すべての SWR フックと複数のキーに対してこれを構成することもできます。詳しくは、 [Next.js の SSG と SSR](/docs/with-nextjs) をチェックしてください。
