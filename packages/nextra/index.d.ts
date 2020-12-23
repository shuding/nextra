
declare module "nextra" {
  import { ComponentType, PropsWithChildren } from "react";

  export type Page<FrontMatter = {}, Meta = {}, Locale = string> =
    | { name: string; route: string; children: PageMap<FrontMatter, Meta, Locale> }
    | { name: string; route: string; frontMatter?: FrontMatter; locale: Locale }
    | { name: "meta.json"; meta: Meta; locale: Locale };

  export type PageMap<FrontMatter = {}, Meta = {}, Locale = string> = Page<
    FrontMatter,
    Meta,
    Locale
  >[];

  export type Options<FrontMatter = any, Meta = any, Locale = string> = {
    filename: string;
    meta?: FrontMatter;
    pageMap: PageMap<FrontMatter, Meta, Locale>;
    route: string;
  };

  export type Theme<Config = any, FrontMatter = any, Meta = any, Locale = string> = (
    opts: Options<FrontMatter, Meta, Locale>,
    config: Config,
  ) => ComponentType<PropsWithChildren<unknown>>;

  const nextra: (theme: string, themeConfig: string) => (nextConf: any) => any;
  export default nextra;
}
