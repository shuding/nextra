# Headers

An example of multi-level anchor headers.

## API Options

```js
const { data, error, isValidating, mutate } = useSWR(key, fetcher, options)
```

### Parameters

- `key`: a unique key string for the request (or a function / array / null) [(advanced usage)](/docs/conditional-fetching)
- `fetcher`: (_optional_) a Promise returning function to fetch your data [(details)](/docs/data-fetching)
- `options`: (_optional_) an object of options for this SWR hook

### key

Either a function that resolves to a value, or a value. The value can be a string, array, or null.

#### Function usage

Function that resolves to a value.

##### Throwing

If the function throws, the key value will be assumed `null`.

###### null

`null` is a value in JavaScript.
