import fs from 'node:fs'
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

export async function createWsWatcherAndGetPort(
  folder: string
): Promise<number> {
  const { promise, resolve } = withResolvers<number>()

  const wss = new WebSocketServer({ port: 0 }, function (this: {
    address: () => AddressInfo
  }) {
    const { port } = this.address()
    logger.info(`ws server is listening on port: ${port}`)
    resolve(port)
  })

  const clients = new Set<WebSocket>()

  wss.on('connection', ws => {
    console.log('adding client', clients.size)
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
