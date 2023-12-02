# Глобальная конфигурация

Контекст `SWRConfig` может предоставить глобальные конфигурации
([опции](/docs/options)) для всех SWR хуков.

```jsx
<SWRConfig value={options}>
  <Component />
</SWRConfig>
```

В этом примере все SWR хуки будут использовать один и тот же fetcher,
предоставленный для загрузки данных JSON, и по умолчанию обновляться каждые 3
секунды:

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard() {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // переопределение

  // ...
}

function App() {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```

## Дополнительные API

### Провайдер кеша

Помимо всех перечисленных [опций](/docs/options), `SWRConfig` также принимает
опциональную функцию `provider`. Пожалуйста, обратитесь к разделу
[Кэш](/docs/cache) для более подробной информации.

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Доступ к глобальным конфигурациям

Вы можете использовать ловушку `useSWRConfig` для получения глобальных
конфигураций, а также [`mutate`](/docs/mutation) и
[`cache`](/docs/advanced/cache):

```jsx
import { useSWRConfig } from 'swr'

function Component() {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

Вложенные конфигурации будут расширены. Если не используется `<SWRConfig>`,
вернётся значение по умолчанию.
