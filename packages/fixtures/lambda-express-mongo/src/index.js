import serverless from 'serverless-http';

import { createApp } from './app.js';

const app = createApp();

export const handler = serverless(app, {
  requestId: 'requestId',
});

export default handler;
