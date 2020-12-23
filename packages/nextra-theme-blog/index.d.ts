declare module "nextra-theme-blog" {
  import { Theme } from "nextra";
  import { ReactNode } from "react";

  export type Config = {
    footer?: ReactNode;
    head?: ReactNode;
    postFooter?: ReactNode;
    readMore?: ReactNode;
  };

  export type FrontMatter = {
    title?: string;
    type?: string;
    description?: string;
  };

  const theme: Theme<Config, FrontMatter>;
  export default theme;
}
