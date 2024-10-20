import meta from "./_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "one",
  route: "/one",
  children: [{
    name: "bar",
    route: "/one/bar",
    frontMatter: {
      "sidebarTitle": "Bar"
    }
  }, {
    name: "foo",
    route: "/one/foo",
    frontMatter: {
      "sidebarTitle": "Foo"
    }
  }, {
    name: "qux",
    route: "/one/qux",
    frontMatter: {
      "sidebarTitle": "Qux"
    }
  }]
}];