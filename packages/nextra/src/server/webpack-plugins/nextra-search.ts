import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { Compiler } from 'webpack'

const execAsync = promisify(exec)

export class NextraSearchPlugin {
  apply(compiler: Compiler) {
    const pluginName = this.constructor.name

    compiler.hooks.afterCompile.tapAsync(pluginName, async (_, callback) => {
      try {
        console.log('starting3')
        const { stdout, stderr } = await execAsync(
          'pagefind --site .next/server/app --output-path .next/static/chunks/app/pagefind'
        )
        console.log(111, stderr)
        console.log(222, stdout)
        callback()
      } catch (error) {
        console.error(333, error)
        callback()
        // callback(error as Error)
      }
    })
  }
}
