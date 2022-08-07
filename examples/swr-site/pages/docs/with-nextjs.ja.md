import { Callout } from 'nextra-theme-docs'

# Next.js での利用

## クライアント側のデータフェッチ

ページに頻繁に更新されるデータがあり、データを事前にレンダリングする必要がない場合、 SWR は特別な設定が必要ないほどピッタリです：
`useSWR` をインポートして、データを使用するコンポーネント内でフックを使用するだけです。

方法は以下の通りです：

- まず、データのないページをすぐに表示します。データがないときはローディング状態を表示することができます。
- 続いて、クライアント側でデータを取得し、準備ができたら表示します。

このアプローチは、たとえばユーザーのダッシュボードページなどで有効です。ダッシュボードは、ユーザー専用のプライベートなページであるため SEO は関係なく、
ページを事前にレンダリングする必要もありません。データは頻繁に更新されるため、リクエスト時のデータ取得処理が必要です。

## デフォルトデータで事前レンダリング

もしページを事前レンダリングする必要がある場合、 Next.js は二つの形式の事前レンダリングの方法をサポートしています：
**Static Generation (SSG)** と **Server-side Rendering (SSR)** 。

SWR と一緒に使えば、SEO 用にページを事前レンダリングしたり、クライアント側でのキャッシュ、再検証、フォーカストラッキング、定期的な再取得などの機能を実行する事ができます。

[`SWRConfig`](/docs/global-configuration) の `fallback` オプションを使うと、事前に取得したデータをすべての SWR フックの初期値として渡すことができます。
たとえば、 `getStaticProps` の場合：

```jsx
 export async function getStaticProps () {
  // `getStaticProps` はサーバー側で実行されます
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
  // `data` は `fallback` を利用して常に利用可能です。
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  // `SWRConfig` の範囲内の SWR フックは、設定の値を使用します。
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

ページはまだ事前レンダリングされています。 SEO に対応し、レスポンスが速いだけでなく、クライアント側の SWR によって完全に機能します。データは動的であり、時間の経過とともに自己更新されます。

<Callout emoji="💡">
  `Article` コンポーネントは、事前に生成されたデータを最初にレンダリングし、ページがハイドレイトされた後、最新のデータを再取得して更新を維持します。
</Callout>
