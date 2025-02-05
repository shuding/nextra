// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import meta from "./_meta.ts";
import {metadata as foo} from "./foo.mdx?metadata";
import {metadata as index} from "./index.mdx?metadata";

export const pageMap = normalizePageMap([{
  data: meta
}, {
  name: "foo",
  route: "/foo",
  frontMatter: foo
}, {
  name: "index",
  route: "/",
  frontMatter: index
}])

export const RouteToFilepath = {
  "foo": "foo.mdx",
  "": "index.mdx"
}