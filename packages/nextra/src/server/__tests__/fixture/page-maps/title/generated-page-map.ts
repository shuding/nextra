// @ts-nocheck
import { normalizePageMap } from 'nextra/page-map'

import meta from "./_meta.ts";
import {metadata as _1_meta} from "./1-meta.mdx?metadata";
import {metadata as _2_sidebar_title} from "./2-sidebar-title.mdx?metadata";
import {metadata as _3_title} from "./3-title.mdx?metadata";
import {metadata as _4_from_filename} from "./4-from-filename.mdx?metadata";
import {metadata as folder_with_index_foo} from "./folder-with-index/foo.mdx?metadata";
import {metadata as folder_with_index_index} from "./folder-with-index/index.mdx?metadata";
import {metadata as folder_bar} from "./folder/bar.mdx?metadata";
import {metadata as folder_index} from "./folder/index.mdx?metadata";

export const pageMap = normalizePageMap([{
  data: meta
}, {
  name: "1-meta",
  route: "/1-meta",
  frontMatter: _1_meta
}, {
  name: "2-sidebar-title",
  route: "/2-sidebar-title",
  frontMatter: _2_sidebar_title
}, {
  name: "3-title",
  route: "/3-title",
  frontMatter: _3_title
}, {
  name: "4-from-filename",
  route: "/4-from-filename",
  frontMatter: _4_from_filename
}, {
  name: "folder-with-index",
  route: "/folder-with-index",
  children: [{
    name: "foo",
    route: "/folder-with-index/foo",
    frontMatter: folder_with_index_foo
  }, {
    name: "index",
    route: "/folder-with-index",
    frontMatter: folder_with_index_index
  }]
}, {
  name: "folder",
  route: "/folder",
  children: [{
    name: "bar",
    route: "/folder/bar",
    frontMatter: folder_bar
  }, {
    name: "index",
    route: "/folder",
    frontMatter: folder_index
  }]
}])

export const RouteToFilepath = {
  "1-meta": "1-meta.mdx",
  "2-sidebar-title": "2-sidebar-title.mdx",
  "3-title": "3-title.mdx",
  "4-from-filename": "4-from-filename.mdx",
  "folder-with-index/foo": "folder-with-index/foo.mdx",
  "folder-with-index": "folder-with-index/index.mdx",
  "folder/bar": "folder/bar.mdx",
  "folder": "folder/index.mdx"
}