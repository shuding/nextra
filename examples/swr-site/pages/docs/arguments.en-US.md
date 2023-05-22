# Arguments

By default, `key` will be passed to `fetcher` as the argument. So the following
3 expressions are equivalent:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## Multiple Arguments

In some scenarios, it's useful to pass multiple arguments (can be any value or
object) to the `fetcher` function. For example an authorized fetch request:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

This is **incorrect**. Because the identifier (also the cache key) of the data
is `'/api/user'`, even if `token` changes, SWR will still use the same key and
return the wrong data.

Instead, you can use an **array** as the `key` parameter, which contains
multiple arguments of `fetcher`:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

The function `fetchWithToken` still accepts the same 2 arguments, but the cache
key will also be associated with `token` now.

## Passing Objects

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
