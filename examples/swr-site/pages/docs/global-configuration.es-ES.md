# Configuración Global

El contexto `SWRConfig` puede proporcionar configuraciones globales
([opciones](/docs/options)) para todos los hooks de SWR.

```jsx
<SWRConfig value={options}>
  <Component />
</SWRConfig>
```

En este ejemplo, todos los hooks de SWR utilizarán el mismo fetcher
proporcionando para cargar datos JSON, y se actualizarán cada 3 segundos por
defecto:

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard() {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // override

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

## Extra APIs

### Cache Provider

Besides all the [options](/docs/options) listed, `SWRConfig` also accepts an
optional `provider` function. Please refer to the [Cache](/docs/cache) section
for more details.

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Access To Global Configurations

You can use the `useSWRConfig` hook to get the global configurations, as well as
[`mutate`](/docs/mutation) and [`cache`](/docs/advanced/cache):

```jsx
import { useSWRConfig } from 'swr'

function Component() {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

Nested configurations will be extended. If no `<SWRConfig>` is used, it will
return the default ones.
