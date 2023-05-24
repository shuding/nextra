# Аргументы

По умолчанию `key` будет передан в `fetcher` в качестве аргумента. Итак,
следующие 3 выражения эквивалентны:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## Множественные аргументы

В некоторых сценариях полезно передать несколько аргументов (может быть любое
значение или объект) в `fetcher`. Например, запрос на выборку с авторизацией:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

Это **неверно**. Поскольку идентификатор (также ключ кеша) данных - это
`'/api/user'`, даже если `token` изменится, SWR все равно будет использовать тот
же ключ и возвращать неверные данные.

Вместо этого вы можете использовать **массив** в качестве параметра `key`,
который содержит несколько аргументов `fetcher`:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

Функция `fetchWithToken` по-прежнему принимает те же 2 аргумента, но ключ кеша
теперь также будет связан с `token`.

## Передача объектов

import { Callout } from 'nextra/components'

<Callout>
  Since SWR 1.1.0, object-like keys will be serialized under the hood automatically. 
</Callout>
  
Say you have another function that fetches data with a user scope: `fetchWithUser(api, user)`. You can do the following:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)

// ...and then pass it as an argument to another useSWR hook
const { data: orders } = useSWR(
  user ? ['/api/orders', user] : null,
  fetchWithUser
)
```

You can directly pass an object as the key, and `fetcher` will receive that
object too:

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

<Callout emoji="⚠️">
  In older versions (< 1.1.0), SWR **shallowly** compares the arguments on every render, and triggers revalidation if any of them has changed. 
</Callout>
