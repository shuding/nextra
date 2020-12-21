import { ComponentType, PropsWithChildren } from "react";

export type Page =
  | { name: string; route: string; children: PageMap }
  | { name: string; route: string; frontMatter?: FrontMatter; locale: string }
  | { name: "meta.json"; meta: Meta; locale: string };
export type PageMap = Page[];
export type Options = {
  filename: string;
  meta?: FrontMatter;
  pageMap: PageMap;
  route: string;
};
export type WithLayout = (opts: Options, config: Config) => ComponentType<PropsWithChildren<{}>>;
const WithNextra: (theme: string, themeConfig: string) => (nextConf: any) => any;
export default WithNextra;

export type Config = any;
export type Meta = any;
export type FrontMatter = any;
