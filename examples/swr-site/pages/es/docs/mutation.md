# Mutación

## Revalidar

You can get the `mutate` function from the `useSWRConfig()` hook, and broadcast
a revalidation message globally to other SWR hooks<sup>\*</sup> using the same
key by calling `mutate(key)`.

Este ejemplo muestra cómo recuperar automáticamente la información de login (por
ejemplo, dentro de `<Profile/>`) cuando el usuario hace clic en el botón
"Logout".

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App() {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button
        onClick={() => {
          // establecer la cookie como caduca
          document.cookie =
            'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

          // indicar a todos SWRs con esta key que se revaliden
          mutate('/api/user')
        }}
      >
        Logout
      </button>
    </div>
  )
}
```

## Mutación y solicitud POST

En muchos casos, la aplicación de mutations locales a los datos es una buena
forma de agilizar los cambios, sin necesidad de esperar a la fuente de datos
remota.

Con `mutate`, puedes actualizar tus datos locales mediante programación,
mientras los revalidas y finalmente los sustituyes por los datos más recientes.

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile() {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button
        onClick={async () => {
          const newName = data.name.toUpperCase()

          // actualiza los datos locales inmediatamente, pero desactiva la revalidación
          mutate('/api/user', { ...data, name: newName }, false)

          // envía una solicitud a la API para actualizar la fuente
          await requestUpdateUsername(newName)

          // activar una revalidación (refetch) para asegurarse de que nuestros datos locales son correctos
          mutate('/api/user')
        }}
      >
        Uppercase my name!
      </button>
    </div>
  )
}
```

Al hacer click en el botón del ejemplo anterior, se actualizarán localmente los
datos del cliente, se enviará una solicitud POST para modificar los datos
remotos y se intentará obtener la última (revalidar).

Pero muchas APIs POST simplemente devolverán los datos actualizados
directamente, por lo que no necesitamos revalidar de nuevo. Aquí hay un ejemplo
que muestra el uso de "local mutate - request - update":

```jsx
mutate('/api/user', newUser, false) // utilice `false` para mutate sin revalidar
mutate('/api/user', updateUser(newUser), false) // `updateUser` es una Promise de la solicitud,
// que devuelve el update document
```

## Mutar basándose en los datos actuales

A veces, se desea actualizar una parte de los datos en función de los datos
actuales.

Con `mutate`, puedes pasar una función asíncrona que recibirá el valor actual de
la caché, si lo hay, y devolverá un updated document.

```jsx
mutate('/api/todos', async todos => {
  // actualicemos la tarea con ID `1` para que se complete,
  // esta API devuelve los datos acutualizado
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // filtrar la lista y devolverla con el item actualizado
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
})
```

## Datos devueltos por Mutate

Lo más probable es que necesites algunos datos para actualizar la caché. Los
datos se resuelven o se devuelven desde la promise o función asíncrona que
pasaste para `mutate`.

La función devolverá update document para que `mutate` actualice el valor de la
caché correspondiente. Podría arrojar un error de alguna manera, cada vez que se
llame.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Manejar un error al actualizar el user aquí
}
```

## Bound Mutate

El objeto SWR devuelto por `useSWR` también contiene una función `mutate()` que
está atada a la key del SWR.

Es funcionalmente equivalente a la función global `mutate` pero no requiere el
parámetro `key`.

```jsx
import useSWR from 'swr'

function Profile() {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button
        onClick={async () => {
          const newName = data.name.toUpperCase()
          // enviar una solicitud a la API para actualizar los datos
          await requestUpdateUsername(newName)
          // actualizar los datos locales inmediatamente y revalidar (refetch)
          // NOTA: la key no es necesaria cuando se utiliza el mutate de useSWR, es pre-bound
          mutate({ ...data, name: newName })
        }}
      >
        Uppercase my name!
      </button>
    </div>
  )
}
```
