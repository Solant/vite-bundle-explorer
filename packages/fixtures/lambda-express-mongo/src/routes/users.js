import { randomBytes } from 'node:crypto';

import { Router } from 'express';

import { users, nextId } from '../mongo.js';
import { parseUser } from '../models/user.js';

const router = Router();

const NAME_RE = /^[a-zA-Z0-9_-]+$/;

function validUsername(raw) {
  return typeof raw === 'string' && NAME_RE.test(raw);
}

async function insertUsers(list) {
  const docs = [];
  for (const body of list) {
    const { user, errors } = parseUser(body);
    if (errors.length > 0) return { errors };
    docs.push({ ...user, id: user.id ?? (await nextId('user')), userStatus: user.userStatus ?? 1 });
  }
  await users().then((c) => c.insertMany(docs));
  return { docs: docs.map(({ _id, ...user }) => user) };
}

// POST /users — create user
router.post('/', async (req, res, next) => {
  try {
    const { docs, errors } = await insertUsers([req.body]);
    if (errors) return res.status(400).json({ errors });
    res.status(201).json(docs[0]);
  } catch (err) {
    next(err);
  }
});

// POST /users/createWithArray
router.post('/createWithArray', async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ errors: ['Body must be an array of users'] });
    const { docs, errors } = await insertUsers(req.body);
    if (errors) return res.status(400).json({ errors });
    res.status(201).json(docs);
  } catch (err) {
    next(err);
  }
});

// POST /users/createWithList
router.post('/createWithList', async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ errors: ['Body must be an array of users'] });
    const { docs, errors } = await insertUsers(req.body);
    if (errors) return res.status(400).json({ errors });
    res.status(201).json(docs);
  } catch (err) {
    next(err);
  }
});

// GET /users/login?username=&password=
router.get('/login', async (req, res, next) => {
  try {
    const { username, password } = req.query;
    if (typeof username !== 'string' || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ errors: ['username and password are required'] });
    }

    const user = await users().then((c) => c.findOne(
      { username, password },
      { projection: { _id: 1 } },
    ));
    if (!user) return res.status(401).json({ errors: ['Invalid username or password'] });

    const token = randomBytes(24).toString('hex');
    res.set('X-Expires-After', new Date(Date.now() + 3600_000).toISOString());
    res.set('X-Rate-Limit', String(5000));
    res.type('text/plain').send(token);
  } catch (err) {
    next(err);
  }
});

// GET /users/logout
router.get('/logout', (_req, res) => {
  res.status(204).end();
});

// GET /users/:username
router.get('/:username', async (req, res, next) => {
  try {
    if (!validUsername(req.params.username)) {
      return res.status(400).json({ errors: ['Invalid username supplied'] });
    }
    const user = await users().then((c) => c.findOne(
      { username: req.params.username },
      { projection: { _id: 0 } },
    ));
    if (!user) return res.status(404).json({ errors: ['User not found'] });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /users/:username
router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!validUsername(username)) {
      return res.status(400).json({ errors: ['Invalid username supplied'] });
    }

    const { user, errors } = parseUser(req.body, { partial: true });
    if (user.username !== undefined && user.username !== username) {
      errors.push('username in body must match the path parameter');
    }
    if (errors.length > 0) return res.status(400).json({ errors });

    const updated = await users().then((c) => c.findOneAndUpdate(
      { username },
      { $set: user },
      { returnDocument: 'after', projection: { _id: 0 } },
    ));
    if (!updated) return res.status(404).json({ errors: ['User not found'] });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /users/:username
router.delete('/:username', async (req, res, next) => {
  try {
    if (!validUsername(req.params.username)) {
      return res.status(400).json({ errors: ['Invalid username supplied'] });
    }
    const deleted = await users().then((c) => c.deleteOne({ username: req.params.username }));
    if (deleted.deletedCount === 0) return res.status(404).json({ errors: ['User not found'] });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
