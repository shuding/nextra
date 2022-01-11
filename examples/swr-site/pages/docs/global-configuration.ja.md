# グローバルな設定

`SWRConfig` コンテキストによって、すべての SWR フックに対するグローバルな設定（ [オプション](/docs/options) ）を提供できます。

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

次の例では、すべての SWR フックに対して、JSON データをロードする同じフェッチャーを使い、デフォルトでは 3 秒ごとに更新するように設定します：

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // オーバーライド

  // ...
}

function App () {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```

## Extra APIs

### キャッシュプロバイダー

紹介されているすべてのオプションに加えて、 `SWRConfig` または `provider` 関数も受け入れます。詳細は[キャッシュ](/docs/cache)セクションを参照してください。

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### グローバル設定へアクセス

`useSWRConfig` フックを使ってグローバル設定、および[`ミューテーション`](/docs/mutation)と[`キャッシュ`](/docs/advanced/cache)を取得できます:

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

ネストされた設定の場合は拡張されます。もし `<SWRConfig>` を使用してない場合は、デフォルトの値を返します。
