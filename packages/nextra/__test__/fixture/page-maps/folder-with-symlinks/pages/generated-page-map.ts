// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'
import {metadata as docs_test2} from "./docs/test2.md";
import {metadata as test1} from "./test1.md";
const _pageMap = [{
  name: "test1",
  route: "/test1",
  frontMatter: test1
}, {
  name: "docs",
  route: "/docs",
  children: [{
    name: "test2",
    route: "/docs/test2",
    frontMatter: docs_test2
  }]
}];

export const pageMap = normalizePageMap(_pageMap)

export const RouteToFilepath = {
  "docs/test2": "docs/test2.md",
  "test1": "test1.md"
}
