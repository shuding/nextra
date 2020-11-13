import getTitle from 'title'

export default function reorderBasedOnMeta (list) {
  let meta = list.find(item => item.name === 'meta.json')
  if (!meta) {
    meta = {}
  } else {
    meta = meta.meta
  }

  const metaKeys = Object.keys(meta)

  return list.filter(a => {
    return a.name !== 'meta.json' && !a.name.startsWith('_')
  }).sort((a, b) => {
    return metaKeys.indexOf(a.name) - metaKeys.indexOf(b.name)
  }).map(a => {
    return {
      ...a,
      children: a.children ? reorderBasedOnMeta(a.children) : undefined,
      title: meta[a.name] || getTitle(a.name)
    }
  })
}
