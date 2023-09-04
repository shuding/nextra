# Argumentos

Por defecto, `key` se pasará a `fetcher` como argumento. Así que las siguientes
3 expresiones son equivalentes:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## Argumentos múltiples

En algunos escenarios, es útil pasar múltiples argumentos (puede pasar cualquier
valor u objeto) a la función `fetcher`. Por ejemplo una solicitud de obtención
autorizada:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

Esto es **incorrecto**. Dado que el identificador (también la key del caché) de
los datos es `'/api/user'`, incluso si el token cambia, SWR seguirá utilizando
la misma key y devolverá los datos incorrectos.

En su lugar, puedes utilizar un **array** como parámetro `key`, que contiene
múltiples argumentos de `fetcher`:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

La función `fetchWithToken` sigue aceptando los mismo 2 argumentos, pero ahora
la key del caché también estará asociada al `token`.

## Pasar objectos

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
