# 인자

기본값으로, `key`는 인자로써 `fetcher`에 전달됩니다. 따라서 다음 세 가지 표현식은 동일합니다.

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## 다중 인자

어떤 시나리오에서는 `fetcher` 함수에 여러 인자(어떠한 값이나 객체도 가능)를 전달하는 것이 유용합니다.
인증된 가져오기 요청 예시입니다: 

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

이는 **올바르지 않습니다**. 왜냐하면 데이터의 식별자(또한 캐시 키)가 `'/api/user'`이고,
만약 `token`이 변경되어도 SWR은 여전히 동일한 키를 사용하기 때문에 잘못된 데이터를 반환합니다.

대신에 `fetcher`의 다중 인자를 포함하는 **배열**을 `key` 파라미터로 사용할 수 있습니다.

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

`fetchWithToken` 함수는 여전히 동일한 두 개의 인자를 받지만, 캐시 키는 이제 `token`과 연결되었습니다.

## 객체 전달

import Callout from 'nextra-theme-docs/callout'

<Callout>
  Since SWR 1.1.0, object-like keys will be serialized under the hood automatically. 
</Callout>
  
Say you have another function that fetches data with a user scope: `fetchWithUser(api, user)`. You can do the following:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)

// ...and then pass it as an argument to another useSWR hook
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

You can directly pass an object as the key, and `fetcher` will receive that object too:

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

<Callout emoji="⚠️">
  In older versions (< 1.1.0), SWR **shallowly** compares the arguments on every render, and triggers revalidation if any of them has changed. 
</Callout>
