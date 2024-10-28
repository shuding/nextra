export const pageMap = [{
  name: "themes",
  route: "/themes",
  children: [{
    name: "bar",
    route: "/themes/bar",
    frontMatter: {
      "sidebarTitle": "Bar"
    }
  }]
}, {
  name: "themes-test",
  route: "/themes-test",
  children: [{
    name: "foo",
    route: "/themes-test/foo",
    frontMatter: {
      "sidebarTitle": "Foo"
    }
  }]
}, {
  name: "themes-test",
  route: "/themes-test",
  frontMatter: {
    "sidebarTitle": "Themes Test"
  }
}, {
  name: "themes",
  route: "/themes",
  frontMatter: {
    "sidebarTitle": "Themes"
  }
}];