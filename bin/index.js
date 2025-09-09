#!/usr/bin/env node
import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const { url } = req;

  const root = process.argv[2];
  const file = path.join(root, url.slice(1) || 'index.html');
  fs.readFile(file).then((buffer) => {
    const extension = path.extname(file);
    res.writeHead(200, { 'content-type': mimeTypes[extension] });
    return res.end(buffer);
  });
});
server.listen(3322);
console.log('Listening on http://localhost:3322');
