/**
 * Player in the room
 */
export interface Player {
  /**
   * The name of player
   *
   * @see https://fumadocs.vercel.app
   * @defaultValue Henry
   */
  name: string;

  /**
   * @example
   * ```js
   * console.log("Hello World")
   * ```
   * @remarks `timestamp`
   * Returned by API
   */
  age: number;

  /**
   * @internal
   */
  privateValue: string;
}
