import { z } from 'zod'

export const pageThemeSchema = z.strictObject({
  breadcrumb: z
    .boolean()
    .optional()
    .describe('Show or hide breadcrumb navigation.'),
  collapsed: z
    .boolean()
    .optional()
    .describe('Indicates whether the item in sidebar is collapsed by default.'),
  footer: z
    .boolean()
    .optional()
    .describe('Specifies whether to display the footer.'),
  layout: z
    .enum(['default', 'full'])
    .optional()
    .describe('Defines the layout style.'),
  navbar: z
    .boolean()
    .optional()
    .describe('Specifies whether to display the navbar.'),
  pagination: z
    .boolean()
    .optional()
    .describe('Determines if pagination controls are shown.'),
  sidebar: z
    .boolean()
    .optional()
    .describe('Specifies whether to display the sidebar.'),
  timestamp: z
    .boolean()
    .optional()
    .describe('Indicates if "last updated" timestamps are displayed.'),
  toc: z
    .boolean()
    .optional()
    .describe('Determines whether a table of contents is displayed.'),
  typesetting: z
    .enum(['default', 'article'])
    .optional()
    .describe('Configures the text typesetting style.')
})
