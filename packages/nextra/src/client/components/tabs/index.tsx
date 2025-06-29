'use no memo'

import type { ComponentProps } from 'react'
import { Tabs as _Tabs, Tab } from './index.client.js'

/**
 * A built-in component for creating tabbed content, helping organize related information in a
 * compact, interactive layout.
 *
 * @example
 * <Tabs>
 *   <Tabs.Tab label="pnpm">**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
 *   <Tabs.Tab label="npm">**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
 *   <Tabs.Tab label="yarn">**Yarn** is a software packaging system.</Tabs.Tab>
 * </Tabs>
 *
 * @usage
 * ```mdx
 * import { Tabs } from 'nextra/components'
 *
 * <Tabs>
 *   <Tabs.Tab label="pnpm">**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
 *   <Tabs.Tab label="npm">**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
 *   <Tabs.Tab label="yarn">**Yarn** is a software packaging system.</Tabs.Tab>
 * </Tabs>
 * ```
 *
 * ### Default Selected Index
 *
 * You can use the `defaultIndex` prop to set the default tab index:
 *
 * ```mdx /defaultIndex="1"/
 * import { Tabs } from 'nextra/components'
 *
 * <Tabs defaultIndex="1">
 *   ...
 * </Tabs>
 * ```
 *
 * And you will have `npm` as the default tab:
 *
 * <Tabs defaultIndex="1">
 *   <Tabs.Tab label="pnpm">**pnpm**: Fast, disk space efficient package manager.</Tabs.Tab>
 *   <Tabs.Tab label="npm">**npm** is a package manager for the JavaScript programming language.</Tabs.Tab>
 *   <Tabs.Tab label="yarn">**Yarn** is a software packaging system.</Tabs.Tab>
 * </Tabs>
 */
export const Tabs = Object.assign(
  // Workaround to fix
  // Error: Cannot access Tab.propTypes on the server. You cannot dot into a client module from a
  // server component. You can only pass the imported name through.
  (props: ComponentProps<typeof _Tabs>) => <_Tabs {...props} />,
  { Tab }
)
