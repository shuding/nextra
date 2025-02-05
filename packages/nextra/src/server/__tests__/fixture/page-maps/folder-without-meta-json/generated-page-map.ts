// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import {metadata as callout} from "./callout.md?metadata";
import {metadata as tabs} from "./tabs.md?metadata";

export const pageMap = normalizePageMap([{
  name: "callout",
  route: "/callout",
  frontMatter: callout
}, {
  name: "tabs",
  route: "/tabs",
  frontMatter: tabs
}])

export const RouteToFilepath = {
  "callout": "callout.md",
  "tabs": "tabs.md"
}