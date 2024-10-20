import meta from "./_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "mix",
  route: "/mix",
  children: [{
    name: "not-specified",
    route: "/mix/not-specified",
    frontMatter: {
      "sidebarTitle": "Not Specified"
    }
  }, {
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