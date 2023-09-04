import { Callout } from 'nextra/components'

# Промежуточное программное обеспечение (ППО) (Middleware)

<Callout>
  Обновитесь до последней версии (≥ 1.0.0), чтобы использовать этот функционал.
</Callout>

Функционал ППО — это новое дополнение в SWR 1.0, которое позволяет вам выполнять
логику до и после SWR хуков.

## Использование

Промежуточное ПО получает SWR хук и может выполнять логику до и после его
запуска. Если ППО несколько, каждый ППО оборачивает последующий. Последний ППО в
списке получит исходный хук SWR — `useSWR`.

### API

```jsx
function myMiddleware(useSWRNext) {
  return (key, fetcher, config) => {
    // До выполнения хука...

    // Обработка следующего ППО, или хука `useSWR`, если это последнее.
    const swr = useSWRNext(key, fetcher, config)

    // После выполнения хука...
    return swr
  }
}
```

Вы можете передать массив из нескольких ППО как опцию `SWRConfig` или `useSWR`:

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// или...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### Расширение

Промежуточное ПО расширяется как обычные опции. Например:

```jsx
function Bar() {
  useSWR(key, fetcher, { use: [c] })
  // ...
}

function Foo() {
  return (
    <SWRConfig value={{ use: [a] }}>
      <SWRConfig value={{ use: [b] }}>
        <Bar />
      </SWRConfig>
    </SWRConfig>
  )
}
```

эквивалентно:

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### Множество промежуточных ПО

Каждое ППО обворачивает последующее, а последнее ППО обворачивает SWR хук.
Например:

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

Порядок выполнения ППО будет `a → b → c`, как показано ниже:

```
вход в  a
  вход в  b
    вход в  c
      useSWR()
    выход из  c
  выход из  b
выход из  a
```

## Примеры

### Регистратор запросов

Давайте в качестве примера создадим простой ППО — регистратора запросов. Он
выводит все запросы fetcher-а, отправленные с этого хука SWR. Вы также можете
использовать этот ППО для всех хуков SWR, добавив его в `SWRConfig`.

```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // Добавим регистратор в исходный fetcher.
    const extendedFetcher = (...args) => {
      console.log('SWR запрос:', key)
      return fetcher(...args)
    }

    // Выполняем хук с новым fetcher-ом.
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... внутри вашего компонента
useSWR(key, fetcher, { use: [logger] })
```

Каждый раз, когда запрос запускается, он выводит ключ SWR в консоль:

```
SWR запрос: /api/user1
SWR запрос: /api/user2
```

### Сохранение предыдущего результата

Иногда вы хотите, чтобы данные, возвращаемые `useSWR`, были «‎запаздывающими».
Даже если ключ изменится, вы все равно хотите, чтобы он возвращал предыдущий
результат, пока не загрузятся новые данные.

Это может быть построено как замедленное ППО используя `useRef`. В этом примере
мы также собираемся расширить возвращаемый объект хука `useSWR`:

```jsx
import { useCallback, useEffect, useRef } from 'react'

// Это ППО SWR для хранения данных даже при изменении ключа.
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // Используйте ссылку для хранения ранее возвращённых данных.
    const laggyDataRef = useRef()

    // Фактический хук SWR.
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // Обновите ссылку если данные определены.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // Предоставьте метод очистки запаздывающих данных, если таковые имеются.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // Возврат к предыдущим данным, если текущие данные не определены.
    const dataOrLaggyData =
      swr.data === undefined ? laggyDataRef.current : swr.data

    // Показывает предыдущие данные?
    const isLagging =
      swr.data === undefined && laggyDataRef.current !== undefined

    // Также добавьте поле `isLagging` в SWR.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy
    })
  }
}
```

Когда вам нужно, чтобы хук SWR работал с задержкой, вы можете использовать это
ППО:

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### Сериализация ключей объекта

<Callout>
  Since SWR 1.1.0, object-like keys will be serialized under the hood automatically. 
</Callout>

<Callout emoji="⚠️">
  In older versions (< 1.1.0), SWR **shallowly** compares the arguments on every render, and triggers revalidation if any of them has changed.
  If you are passing serializable objects as the key. You can serialize object keys to ensure its stability, a simple middleware can help:
</Callout>

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // Сериализуйте ключ.
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // Передайте сериализованный ключ и десериализуйте его в fetcher-е.
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ... или включите его глобально с помощью
<SWRConfig value={{ use: [serialize] }}>
```

Вам не нужно беспокоиться о том, что объект может измениться между рендерами. Он
всегда сериализуется в одну и ту же строку, и fetcher по-прежнему получит эти
аргументы объекта.

<Callout>
  Кроме того, вы можете использовать такие библиотеки, как [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) вместо `JSON.stringify` — быстрее и стабильнее.
</Callout>
