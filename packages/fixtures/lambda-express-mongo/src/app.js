import express from 'express';

import petRoutes from './routes/pets.js';
import storeRoutes from './routes/store.js';
import userRoutes from './routes/users.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (_req, res) => {
    res.json({ name: 'petstore-api', version: '1.0.0' });
  });

  app.use('/pets', petRoutes);
  app.use('/store', storeRoutes);
  app.use('/users', userRoutes);

  app.use((_req, res) => {
    res.status(404).json({ errors: ['Route not found'] });
  });

  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.parse.failed') {
      return res.status(400).json({ errors: ['Malformed JSON body'] });
    }
    if (err?.code === 121) {
      return res.status(400).json({ errors: ['Document failed validation'], detail: err.errInfo });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ errors: ['Duplicate key', String(err.keyValue ?? '')] });
    }
    console.error(err);
    res.status(500).json({ errors: ['Internal server error'] });
  });

  return app;
}
