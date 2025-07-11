#!/usr/bin/env node
import { createServer } from 'node:http';
import fs from 'node:fs/promises'
import path from 'node:path'

const statsFile = path.resolve(process.cwd(), process.argv[2] ?? 'dist/stats.json')
const stats = await fs.readFile(statsFile, { encoding: 'utf-8' })

const mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
}

const server = createServer((req, res) => {
  const { url } = req

  if (url === '/stats.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(stats)
  }

  const file = path.join(import.meta.dirname, '..', 'dist', url.slice(1) || 'index.html')
  fs.readFile(file)
    .then(buffer => {
      const extension = path.extname(file)
      res.writeHead(200, { 'content-type': mimeTypes[extension] })
      return res.end(buffer)
    })
})
server.listen(3322)
