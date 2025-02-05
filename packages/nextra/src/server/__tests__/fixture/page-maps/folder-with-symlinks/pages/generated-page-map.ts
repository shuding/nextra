// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import {metadata as docs_test2} from "./docs/test2.md?metadata";
import {metadata as test1} from "./test1.md?metadata";

export const pageMap = normalizePageMap([{
  name: "docs",
  route: "/docs",
  children: [{
    name: "test2",
    route: "/docs/test2",
    frontMatter: docs_test2
  }]
}, {
  name: "test1",
  route: "/test1",
  frontMatter: test1
}])

export const RouteToFilepath = {
  "docs/test2": "docs/test2.md",
  "test1": "test1.md"
}