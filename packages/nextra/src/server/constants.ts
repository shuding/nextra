/*
 * Benefit of server/constants - do not include unneeded `path` polyfill in client bundle,
 * while importing constants in client file
 */
import path from 'node:path'

export const CWD = process.cwd()

export const PUBLIC_DIR = path.join(CWD, 'public')

export const CHUNKS_DIR = path.join(CWD, '.next', 'static', 'chunks')
