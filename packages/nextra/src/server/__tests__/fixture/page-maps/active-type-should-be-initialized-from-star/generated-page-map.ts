// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import meta from "./_meta.ts";
import _1_level_meta from "./1-level/_meta.ts";
import {metadata as _1_level_foo} from "./1-level/foo.md?metadata";

export const pageMap = normalizePageMap([{
  data: meta
}, {
  name: "1-level",
  route: "/1-level",
  children: [{
    data: _1_level_meta
  }, {
    name: "foo",
    route: "/1-level/foo",
    frontMatter: _1_level_foo
  }]
}])

export const RouteToFilepath = {
  "1-level/foo": "1-level/foo.md"
}