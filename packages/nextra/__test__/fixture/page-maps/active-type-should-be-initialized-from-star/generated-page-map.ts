import meta from "./_meta.ts";
import _1_level_meta from "./1-level/_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "1-level",
  route: "/1-level",
  children: [{
    data: _1_level_meta
  }, {
    name: "foo",
    route: "/1-level/foo",
    frontMatter: {
      "sidebarTitle": "Foo"
    }
  }]
}];
