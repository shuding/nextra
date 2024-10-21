import meta from "./_meta.ts";
import docs_meta from "./docs/_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "docs",
  route: "/docs",
  children: [{
    data: docs_meta
  }, {
    name: "bar",
    route: "/docs/bar",
    frontMatter: {
      "sidebarTitle": "Bar"
    }
  }]
}, {
  name: "foo",
  route: "/foo",
  frontMatter: {
    "sidebarTitle": "Foo"
  }
}];
