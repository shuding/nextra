import getTitle from 'title'

export default function cleanupAndReorder(list, locale) {
  let meta
  for (let item of list) {
    if (item.name === 'meta.json' && locale === item.locale) {
      meta = item
      break
    }
    if (!meta && item.name === 'meta') {
      meta = item
    }
  }
  if (!meta) {
    meta = {}
  } else {
    meta = meta.meta
  }

  const metaKeys = Object.keys(meta)

  return list
    .filter(a => {
      return a.name !== 'meta.json' && !a.name.startsWith('_') && (a.locale === locale || !a.locale)
    })
    .sort((a, b) => {
      return metaKeys.indexOf(a.name) - metaKeys.indexOf(b.name)
    })
    .map(a => {
      return {
        ...a,
        children: a.children ? cleanupAndReorder(a.children, locale) : undefined,
        title: meta[a.name] || getTitle(a.name)
      }
    })
}
