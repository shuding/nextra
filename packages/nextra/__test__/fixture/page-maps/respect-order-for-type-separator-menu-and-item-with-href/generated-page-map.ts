import one_two_meta from "./one/two/_meta.ts";
export const pageMap = [{
  name: "one",
  route: "/one",
  children: [{
    name: "two",
    route: "/one/two",
    children: [{
      data: one_two_meta
    }, {
      name: "1-one",
      route: "/one/two/1-one",
      frontMatter: {
        "sidebarTitle": "1 One"
      }
    }, {
      name: "2024",
      route: "/one/two/2024",
      frontMatter: {
        "sidebarTitle": "2024"
      }
    }, {
      name: "foo",
      route: "/one/two/foo",
      frontMatter: {
        "sidebarTitle": "Foo"
      }
    }, {
      name: "one",
      route: "/one/two/one",
      frontMatter: {
        "sidebarTitle": "One"
      }
    }, {
      name: "qux",
      route: "/one/two/qux",
      frontMatter: {
        "sidebarTitle": "Qux"
      }
    }]
  }]
}];
