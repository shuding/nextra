declare module 'react-compiler-webpack/dist/react-compiler-loader.js' {
  export default function reactCompilerLoader(
    source: string | Buffer
  ): Promise<void>
}
