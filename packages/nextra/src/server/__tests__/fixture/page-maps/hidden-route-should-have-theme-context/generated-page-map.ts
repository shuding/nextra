// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import meta from "./_meta.ts";
import _1_level_2_level_meta from "./1-level/2-level/_meta.ts";
import {metadata as _1_level_2_level_foo} from "./1-level/2-level/foo.md?metadata";
import {metadata as _1_level_qux} from "./1-level/qux.md?metadata";
import {metadata as bar} from "./bar.md?metadata";

export const pageMap = normalizePageMap([{
  data: meta
}, {
  name: "1-level",
  route: "/1-level",
  children: [{
    name: "2-level",
    route: "/1-level/2-level",
    children: [{
      data: _1_level_2_level_meta
    }, {
      name: "foo",
      route: "/1-level/2-level/foo",
      frontMatter: _1_level_2_level_foo
    }]
  }, {
    name: "qux",
    route: "/1-level/qux",
    frontMatter: _1_level_qux
  }]
}, {
  name: "bar",
  route: "/bar",
  frontMatter: bar
}])

export const RouteToFilepath = {
  "1-level/2-level/foo": "1-level/2-level/foo.md",
  "1-level/qux": "1-level/qux.md",
  "bar": "bar.md"
}