import fs from 'graceful-fs'
import { WebSocketServer } from 'ws'
import type { AddressInfo, WebSocket } from 'ws'
import { logger } from './utils.js'

// Polyfill for Promise.withResolvers
function withResolvers<T>() {
  let resolve: (value: T) => void
  let reject: (reason: any) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve: resolve!, reject: reject! }
}

// Based on https://www.steveruiz.me/posts/nextjs-refresh-content
// and https://github.com/gaearon/overreacted.io/pull/797
export async function createWsWatcherAndGetPort(
  folder: string
): Promise<number> {
  const { promise, resolve } = withResolvers<number>()

  const wss = new WebSocketServer(
    // to get random port
    { port: 0 },
    function (this: { address: () => AddressInfo }) {
      const { port } = this.address()
      logger.info(`ws server is listening on port: ${port}`)
      resolve(port)
    }
  )

  const clients = new Set<WebSocket>()

  wss.on('connection', ws => {
    clients.add(ws)
    ws.on('error', logger.error)
    ws.on('close', () => {
      clients.delete(ws)
    })
  })

  fs.watch(folder, { recursive: true }, (_eventType, _fileName) => {
    for (const ws of clients) {
      ws.send('refresh')
    }
  })

  return promise
}
