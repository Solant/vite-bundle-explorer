#!/usr/bin/env node
/* eslint-disable no-console */
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

  // eslint-disable-next-line no-undef
  const root = process.argv[2];
  const file = path.join(root, url.slice(1) || 'index.html');
  fs.readFile(file)
    .then((buffer) => {
      const extension = path.extname(file);
      res.writeHead(200, { 'content-type': mimeTypes[extension] });
      return res.end(buffer);
    })
    .catch(() => {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('Not found');
    });
});
server.listen(3322);
console.log('Listening on http://localhost:3322');
