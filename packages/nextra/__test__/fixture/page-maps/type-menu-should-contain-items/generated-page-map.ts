// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'
import meta from "./_meta.ts";
import {metadata as mix_not_specified} from "./mix/not-specified.md";
import {metadata as mix_qux} from "./mix/qux.md";
import {metadata as pagesOnly_one} from "./pagesOnly/one.md";
import {metadata as pagesOnly_two} from "./pagesOnly/two.md";
const _pageMap = [{
  data: meta
}, {
  name: "pagesOnly",
  route: "/pagesOnly",
  children: [{
    name: "one",
    route: "/pagesOnly/one",
    frontMatter: pagesOnly_one
  }, {
    name: "two",
    route: "/pagesOnly/two",
    frontMatter: pagesOnly_two
  }]
}, {
  name: "mix",
  route: "/mix",
  children: [{
    name: "not-specified",
    route: "/mix/not-specified",
    frontMatter: mix_not_specified
  }, {
    name: "qux",
    route: "/mix/qux",
    frontMatter: mix_qux
  }]
}];

export const pageMap = normalizePageMap(_pageMap)

export const RouteToFilepath = {
  "mix/not-specified": "mix/not-specified.md",
  "mix/qux": "mix/qux.md",
  "pagesOnly/one": "pagesOnly/one.md",
  "pagesOnly/two": "pagesOnly/two.md"
}
