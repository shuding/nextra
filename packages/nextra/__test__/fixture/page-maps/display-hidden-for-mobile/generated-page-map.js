import test_fixture_page_maps_display_hidden_for_mobile_meta from "./_meta.ts";
export const pageMap = [{
  data: test_fixture_page_maps_display_hidden_for_mobile_meta
}, {
  name: "bar",
  route: "/bar",
  children: [{
    name: "baz",
    route: "/bar/baz",
    children: [{
      name: "quz",
      route: "/bar/baz/quz",
      children: [{
        name: "qwe",
        route: "/bar/baz/quz/qwe",
        frontMatter: {
          "sidebar_label": "Qwe"
        }
      }]
    }]
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "sidebar_label": "Index"
  }
}];