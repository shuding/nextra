// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'
import {metadata as callout} from "./callout.md";
import {metadata as tabs} from "./tabs.md";
const _pageMap = [{
  name: "callout",
  route: "/callout",
  frontMatter: callout
}, {
  name: "tabs",
  route: "/tabs",
  frontMatter: tabs
}];

export const pageMap = normalizePageMap(_pageMap)

export const RouteToFilepath = {
  "callout": "callout.md",
  "tabs": "tabs.md"
}
