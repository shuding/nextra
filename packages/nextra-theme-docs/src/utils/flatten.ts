export default function flatten<T extends any[]>(list: T): T {
  return list.reduce((flat, toFlatten) => {
    return flat.concat(
      toFlatten.children ? flatten(toFlatten.children) : toFlatten
    )
  }, [])
}
