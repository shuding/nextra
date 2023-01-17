declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}

declare namespace globalThis {
  var __nextra_temp_do_not_use: () => void
}

declare module 'next/dist/compiled/webpack/webpack' {
  export { default as webpack, sources } from 'webpack'
}
