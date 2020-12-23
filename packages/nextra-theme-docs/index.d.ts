
declare module "nextra-theme-docs" {
  import { Theme as NextraTheme } from "nextra";
  import { ComponentType, PropsWithChildren, ReactNode } from "react";

  export type Config<Locale = string> = {
    repository?: string;
    branch?: string;
    path?: string;
    titleSuffix?: string;
    logo?: ReactNode | ComponentType<{ locale: Locale }>;
    head?: ReactNode | ComponentType<{ locale: Locale }>;
    search?: boolean;
    prevLinks?: boolean;
    nextLinks?: boolean;
    footer?: boolean;
    footerEditOnGitHubLink?: boolean;
    footerEditOnGitHubText?: ReactNode | ComponentType<{ locale: Locale }>;
    footerText?: ReactNode | ComponentType<{ locale: Locale }>;
    i18n?: { locale: Locale; text: string; direction: string }[];
  };

  export type FrontMatter = {
    title?: string;
    full?: boolean;
  };

  export type Meta = {
    [name in string]?: string;
  };

  export const Callout: ComponentType<PropsWithChildren<{ background?: string; emoji?: string }>>;

  export const Bleed: ComponentType<PropsWithChildren<{ full?: boolean }>>;

  const theme: NextraTheme<Config, FrontMatter, Meta>;
  export default theme;
}
