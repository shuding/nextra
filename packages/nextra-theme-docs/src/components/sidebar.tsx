import cn from 'clsx'
import type { Heading } from 'nextra'
import { Button } from 'nextra/components'
import { useFSRoute, useMounted } from 'nextra/hooks'
import { ArrowRightIcon, ExpandIcon } from 'nextra/icons'
import type { Item, MenuItem, PageItem } from 'nextra/normalize-pages'
import type { FocusEventHandler, ReactElement } from 'react'
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useActiveAnchor, useMenu, useThemeConfig } from '../contexts'
import { renderComponent } from '../utils'
import { Anchor } from './anchor'
import { Collapse } from './collapse'
import { LocaleSwitch } from './locale-switch'

// ... (rest of the imports and existing code)

function sortDirectories(directories: (PageItem | Item)[]): (PageItem | Item)[] {
  return directories.sort((a, b) => {
    if (a.sort !== undefined && b.sort !== undefined) {
      return a.sort - b.sort
    }
    if (a.sort !== undefined) return -1
    if (b.sort !== undefined) return 1
    return 0
  })
}

function Menu({
  directories,
  anchors,
  className,
  onlyCurrentDocs
}: MenuProps): ReactElement {
  const onFocus = useContext(OnFocusItemContext)

  const handleFocus: FocusEventHandler = useCallback(
    event => {
      const route =
        event.target.getAttribute('href') ||
        event.target.getAttribute('data-href') ||
        ''
      onFocus(route)
    },
    [onFocus]
  )

  const sortedDirectories = useMemo(() => sortDirectories(directories), [directories])

  return (
    <ul className={cn(classes.list, className)}>
      {sortedDirectories.map(item => {
        if (onlyCurrentDocs && !item.isUnderCurrentDocsTree) return null

        const ComponentToUse =
          item.type === 'menu' ||
          (item.children && (item.children.length || !item.withIndexPage))
            ? Folder
            : File

        return (
          <ComponentToUse
            key={item.name}
            item={item}
            anchors={anchors}
            onFocus={handleFocus}
          />
        )
      })}
    </ul>
  )
}

// ... (rest of the existing code)