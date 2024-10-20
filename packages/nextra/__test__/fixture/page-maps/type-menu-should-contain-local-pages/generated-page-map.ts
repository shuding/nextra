import meta from "./_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "mix",
  route: "/mix",
  children: [{
    name: "qux",
    route: "/mix/qux",
    frontMatter: {
      "sidebarTitle": "Qux"
    }
  }]
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
  }]
}];