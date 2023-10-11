import test_fixture_page_maps_settings_and_page_dont_exist_meta from "/Users/dmytro/Desktop/nextra/packages/nextra/__test__/fixture/page-maps/*-settings-and-page-dont-exist/_meta.ts";
export const pageMap = [];
const dynamicMetaModules = {
  "/": test_fixture_page_maps_settings_and_page_dont_exist_meta
};

const resolvePageMap = () => {}

if (typeof window === 'undefined') {
  globalThis.__nextra_resolvePageMap ||= Object.create(null)
  globalThis.__nextra_resolvePageMap[''] = resolvePageMap('', dynamicMetaModules)
}