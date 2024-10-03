// @ts-check

import fs from 'node:fs'
import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import { logger } from './utils.js'

const CONTENT_FOLDER = 'mdx'

export function createWsWatcher(folder: string): void {
  fs.watch(
    CONTENT_FOLDER,
    { persistent: true, recursive: true },
    (_eventType, _fileName) => {
      for (const ws of clients) {
        // do any pre-processing you want to do here...
        ws.send('refresh')
      }
    }
  )

  const wss = new WebSocketServer({ port: 1337 })

  const clients = new Set<WebSocket>()

  wss.on('connection', ws => {
    console.log('adding client', clients.size)
    clients.add(ws)
    ws.on('error', logger.error)
    ws.on('close', () => {
      clients.delete(ws)
    })
  })
}
