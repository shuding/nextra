import meta from "./_meta.ts";
import _1_level_2_level_meta from "./1-level/2-level/_meta.ts";
export const pageMap = [{
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
      frontMatter: {
        "sidebarTitle": "Foo"
      }
    }]
  }, {
    name: "qux",
    route: "/1-level/qux",
    frontMatter: {
      "sidebarTitle": "Qux"
    }
  }]
}, {
  name: "bar",
  route: "/bar",
  frontMatter: {
    "sidebarTitle": "Bar"
  }
}];