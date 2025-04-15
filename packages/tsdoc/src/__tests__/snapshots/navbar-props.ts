type $ = {
  /**
   * Extra content after last icon.
   */
  children?: React.ReactNode

  /**
   * Specifies whether the logo should have a link or provides the URL for the logo's link.
   * @default true
   */
  logoLink?: string | boolean

  /**
   * Logo of the website.
   */
  logo: React.ReactElement

  /**
   * URL of the project homepage.
   */
  projectLink?: string

  /**
   * Icon of the project link.
   * @default <GitHubIcon />
   */
  projectIcon?: React.ReactNode

  /**
   * URL of the chat link.
   */
  chatLink?: string

  /**
   * Icon of the chat link.
   * @default <DiscordIcon />
   */
  chatIcon?: React.ReactNode

  /**
   * CSS class name.
   */
  className?: string

  /**
   * Aligns navigation links to the specified side.
   * @default "right"
   */
  align?: "left" | "right"
}