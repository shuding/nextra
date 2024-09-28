# Mutation

## Revalidate

You can get the `mutate` function from the `useSWRConfig()` hook, and broadcast
a revalidation message globally to other SWR hooks<sup>\*</sup> using the same
key by calling `mutate(key)`.

This example shows how to automatically refetch the login info (e.g. inside
`<Profile/>`) when the user clicks the “Logout” button.

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App() {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button
        onClick={() => {
          // set the cookie as expired
          document.cookie =
            'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

          // tell all SWRs with this key to revalidate
          mutate('/api/user')
        }}
      >
        Logout
      </button>
    </div>
  )
}
```

\*: _It broadcasts to SWR hooks under the same [cache provider](/docs/cache)
scope. If no cache provider exists, it will broadcast to all SWR hooks._

## Mutation and POST Request

In many cases, applying local mutations to data is a good way to make changes
feel faster — no need to wait for the remote source of data.

With `mutate`, you can update your local data programmatically, while
revalidating and finally replace it with the latest data.

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

          // update the local data immediately, but disable the revalidation
          mutate('/api/user', { ...data, name: newName }, false)

          // send a request to the API to update the source
          await requestUpdateUsername(newName)

          // trigger a revalidation (refetch) to make sure our local data is correct
          mutate('/api/user')
        }}
      >
        Uppercase my name!
      </button>
    </div>
  )
}
```

Clicking the button in the example above will locally update the client data,
send a POST request to modify the remote data and try to fetch the latest one
(revalidate).

But many POST APIs will just return the updated data directly, so we don’t need
to revalidate again. Here’s an example showing the “local mutate - request -
update” usage:

```jsx
mutate('/api/user', newUser, false) // use `false` to mutate without revalidation
mutate('/api/user', updateUser(newUser), false) // `updateUser` is a Promise of the request,
// which returns the updated document
```

## Mutate Based on Current Data

Sometimes, you want to update a part of your data based on the current data.

With `mutate`, you can pass an async function which will receive the current
cached value, if any, and returns an updated document.

```jsx
mutate('/api/todos', async todos => {
  // let's update the todo with ID `1` to be completed,
  // this API returns the updated data
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // filter the list, and return it with the updated item
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
})
```

## Returned Data from Mutate

Most probably, you need some data to update the cache. The data is resolved or
returned from the promise or async function you passed to `mutate`.

The function passed to `mutate` will return an updated document which is used to
update the corresponding cache value. If there is an error thown while executing
the function, the error will be thrown so it can be handled appropriately.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Handle an error while updating the user here
}
```

## Bound Mutate

The SWR object returned by `useSWR` also contains a `mutate()` function that is
pre-bound to the SWR's key.

It is functionally equivalent to the global `mutate` function but does not
require the `key` parameter.

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
          // send a request to the API to update the data
          await requestUpdateUsername(newName)
          // update the local data immediately and revalidate (refetch)
          // NOTE: key is not required when using useSWR's mutate as it's pre-bound
          mutate({ ...data, name: newName })
        }}
      >
        Uppercase my name!
      </button>
    </div>
  )
}
```
