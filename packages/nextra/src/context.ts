interface Page {
  name: string
  route: string
  children?: Page[]
  meta: {
    type?: string
    title?: string
    hidden?: boolean
  }
  frontMatter?: any
}

function getContext(name: string) {
  if (!(globalThis as any).__nextra_internal__) {
    throw new Error(
      `Nextra context not found. Please make sure you are using "${name}" of "nextra/context" on a Nextra page.`
    )
  }
  return (globalThis as any).__nextra_internal__
}

function normalizeMeta(meta: any) {
  if (typeof meta === 'string') {
    meta = {
      title: meta
    }
  }
  return meta
}

function filter(pageMap: any, activeLevel?: string) {
  let activeLevelPages: Page[] | undefined
  let meta = pageMap.find((item: any) => item.name === 'meta.json')?.meta || {}
  const metaKeys = Object.keys(meta)

  const items: Page[] = []
  for (const item of pageMap) {
    if (item.name === 'meta.json') continue
    const page: Page = {
      ...item,
      meta: normalizeMeta(meta[item.name])
    }
    if (item.children) {
      const filteredChildren = filter(item.children, activeLevel)
      page.children = filteredChildren[0]
      if (filteredChildren[1]) {
        activeLevelPages = filteredChildren[1]
      }
    }
    items.push(page)
    if (page.route === activeLevel) {
      activeLevelPages = items
    }
  }

  return [
    items.sort((a, b) => {
      const indexA = metaKeys.indexOf(a.name)
      const indexB = metaKeys.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    }),
    activeLevelPages
  ]
}

export function getAllPages() {
  const internal = getContext('getAllPages')
  return filter(internal.pageMap)[0]
}

export function getCurrentLevelPages() {
  const internal = getContext('getCurrentLevelPages')
  return filter(internal.pageMap, internal.route)[1] || []
}

export function getPagesUnderRoute(route: string) {
  const internal = getContext('getPagesUnderRoute')
  return filter(internal.pageMap, route)[1] || []
}
