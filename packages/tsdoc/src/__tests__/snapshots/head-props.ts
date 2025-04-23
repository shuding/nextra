interface $$ {
  /**
   * @default {
   *   "hue": {
   *     "dark": 204,
   *     "light": 212
   *   },
   *   "saturation": {
   *     "dark": 100,
   *     "light": 100
   *   },
   *   "lightness": {
   *     "dark": 55,
   *     "light": 45
   *   }
   * }
   */
  color?: {
    /**
     * The hue of the primary theme color.<br/>Range: `0 - 360`
     * @default {
     *   "dark": 204,
     *   "light": 212
     * }
     */
    hue?: number | {
      dark: number

      light: number
    }

    /**
     * The saturation of the primary theme color.<br/>Range: `0 - 100`
     * @default 100
     */
    saturation?: number | {
      dark: number

      light: number
    }

    /**
     * The lightness of the primary theme color.<br/>Range: `0 - 100`
     * @default {
     *   "dark": 55,
     *   "light": 45
     * }
     */
    lightness?: number | {
      dark: number

      light: number
    }
  }

  /**
   * The glyph to use as the favicon.
   */
  faviconGlyph?: string

  /**
   * @default {
   *   "dark": "17,17,17",
   *   "light": "250,250,250"
   * }
   */
  backgroundColor?: {
    /**
     * Background color for dark theme.<br/>Format: `"rgb(RRR,GGG,BBB)" | "#RRGGBB"`
     * @default "rgb(17,17,17)"
     */
    dark?: string

    /**
     * Background color for light theme.<br/>Format: `"rgb(RRR,GGG,BBB)" | "#RRGGBB"`
     * @default "rgb(250,250,250)"
     */
    light?: string
  }

  /**
   * Content of `<head>`.
   */
  children?: React.ReactNode
}