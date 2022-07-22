# ミューテーション

## 再検証

`useSWRConfig()` フックから `mutate` 関数を取得し、`mutate(key)` を呼び出すことで、
再検証メッセージを他の SWR フック<sup>\*</sup>に渡すことができます。

次の例では、ユーザーが "Logout" ボタンをクリックしたときに、ログイン情報
（ たとえば `<Profile/> `の中身 ）を自動的に取得する方法を示します。

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // クッキーを期限切れとして設定します
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // このキーを使用してすべての SWR に再検証するように指示します
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

\*: 同じ [キャッシュプロバイダー](/docs/cache) のスコープ下では、 SWR フックに渡されます。もしキャッシュプロバイダーが無ければ、すべての SWR フックに渡されます。

## ミューテーションと POST リクエスト

多くの場合、データにローカルミューテーションを適用することは、変更をより速く
感じさせるための良い方法です。データのリモートソースを待つ必要はありません。

`mutate` を使用すると、再検証の間にプログラムでローカルデータを更新しておき、
最終的に最新のデータに置き換えることができます。

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()

        // 再検証をせずに直ちにローカルデータを更新します
        mutate('/api/user', { ...data, name: newName }, false)

        // ソースを更新するために API にリクエストを送信します
        await requestUpdateUsername(newName)

        // ローカルデータが最新であることを確かめるために再検証（再取得）を起動します
        mutate('/api/user')
      }}>Uppercase my name!</button>
    </div>
  )
}
```

上記の例でボタンをクリックすると、ローカルでクライアントデータを更新し、
リモートデータを修正するための POST リクエストを送信して、最新のデータを取得します（再検証）。

ただし、多くの POST API は更新されたデータを直接返すだけなので、再度再検証する必要はありません。
「ローカルミューテート - リクエスト - 更新」の使用法を示す例を次に示します。

```jsx
mutate('/api/user', newUser, false)             // 再検証せずに変更するには、`false` を使用します
mutate('/api/user', updateUser(newUser), false) // `updateUser` は、このリクエストの Promise であり、
                                                // 更新されたドキュメントを返します
```

## 現在のデータにもとづいたミューテート

現在のデータにもとづいて、データの一部を更新したい場合があります。

`mutate` を使用すると、現在キャッシュされている値がある場合はそれを受け取り、更新されたドキュメントを返す非同期関数を渡すことができます。

```jsx
mutate('/api/todos', async todos => {
  // 完了するために ID `1` で todo を更新しましょう。
  // この API は更新されたデータを返します。
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // リストをフィルタリングし、更新されたアイテムを返します
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
})
```

## ミューテートから返されたデータ

ほとんどの場合、キャッシュを更新するためにいくつかのデータが必要です。データは、`mutate` に渡された promise や非同期関数から解決または返されます。

`mutate` に渡されるこの関数は、対応するキャッシュ値を更新できるように、更新されたドキュメントを返します。この関数を実行している際にエラーが発生したときには、適切な対処ができるようにそのエラーを投げます。

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // ここでユーザーの更新中にエラーを処理します
}
```

## バウンドミューテート

`useSWR` によって返される SWR オブジェクトには、SWR のキーに事前にバインドされている `mutate()` 関数も含まれています。

機能的にはグローバルな `mutate` 関数と同等ですが、`key` パラメーターは必要ありません。

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // このデータを更新するために API へリクエストを送ります
        await requestUpdateUsername(newName)
        // ローカルデータをすぐに更新し、再検証（再フェッチ）します
        // 注：useSWR の mutate を事前にバインドされているものとして使用する場合にはキーは必要ありません
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```
