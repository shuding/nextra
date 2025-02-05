// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import meta from "./_meta.js";
import {metadata as test_foo} from "./test/foo.md?metadata";

export const pageMap = normalizePageMap([{
  data: meta
}, {
  name: "test",
  route: "/test",
  children: [{
    name: "foo",
    route: "/test/foo",
    frontMatter: test_foo
  }]
}])

export const RouteToFilepath = {
  "test/foo": "test/foo.md"
}