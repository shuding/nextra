// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import {metadata as one_two_2024} from "./one/two/2024.md?metadata";
import one_two_meta from "./one/two/_meta.ts";
import {metadata as one_two_1_one} from "./one/two/1-one.md?metadata";
import {metadata as one_two_foo} from "./one/two/foo.md?metadata";
import {metadata as one_two_one} from "./one/two/one.md?metadata";
import {metadata as one_two_qux} from "./one/two/qux.md?metadata";

export const pageMap = normalizePageMap([{
  name: "one",
  route: "/one",
  children: [{
    name: "two",
    route: "/one/two",
    children: [{
      name: "2024",
      route: "/one/two/2024",
      frontMatter: one_two_2024
    }, {
      data: one_two_meta
    }, {
      name: "1-one",
      route: "/one/two/1-one",
      frontMatter: one_two_1_one
    }, {
      name: "foo",
      route: "/one/two/foo",
      frontMatter: one_two_foo
    }, {
      name: "one",
      route: "/one/two/one",
      frontMatter: one_two_one
    }, {
      name: "qux",
      route: "/one/two/qux",
      frontMatter: one_two_qux
    }]
  }]
}])

export const RouteToFilepath = {
  "one/two/1-one": "one/two/1-one.md",
  "one/two/2024": "one/two/2024.md",
  "one/two/foo": "one/two/foo.md",
  "one/two/one": "one/two/one.md",
  "one/two/qux": "one/two/qux.md"
}