// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'
import meta from "./_meta.ts";
import {metadata as blog_} from "./blog/_.md";
import {metadata as blog_a} from "./blog/a.md";
import {metadata as blog_index} from "./blog/index.md";
const _pageMap = [{
  data: meta
}, {
  name: "blog",
  route: "/blog",
  children: [{
    name: "_",
    route: "/blog/_",
    frontMatter: blog_
  }, {
    name: "a",
    route: "/blog/a",
    frontMatter: blog_a
  }, {
    name: "index",
    route: "/blog",
    frontMatter: blog_index
  }]
}];

export const pageMap = normalizePageMap(_pageMap)

export const RouteToFilepath = {
  "blog/_": "blog/_.md",
  "blog/a": "blog/a.md",
  "blog": "blog/index.md"
}
