import express, { Router } from 'express';

import { pets, nextId } from '../mongo.js';
import { PET_STATUSES, parsePet } from '../models/pet.js';

const router = Router();

function parsePetId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id >= 0 ? id : null;
}

// POST /pets — add a pet
router.post('/', async (req, res, next) => {
  try {
    const { pet, errors } = parsePet(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const doc = { ...pet, id: pet.id ?? (await nextId('pet')), status: pet.status ?? 'available' };
    await pets().then((c) => c.insertOne(doc));
    const { _id, ...created } = doc;
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /pets — update an existing pet (full replace, id in body)
router.put('/', async (req, res, next) => {
  try {
    const { pet, errors } = parsePet(req.body);
    if (pet.id === undefined) errors.push('id is required');
    if (errors.length > 0) return res.status(400).json({ errors });

    const result = await pets().then((c) => c.findOneAndUpdate(
      { id: pet.id },
      { $set: pet },
      { returnDocument: 'after', projection: { _id: 0 } },
    ));
    if (!result) return res.status(404).json({ errors: ['Pet not found'] });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /pets/findByStatus?status=available,pending
router.get('/findByStatus', async (req, res, next) => {
  try {
    const requested = String(req.query.status ?? 'available').split(',').map((s) => s.trim());
    const invalid = requested.filter((s) => !PET_STATUSES.includes(s));
    if (invalid.length > 0) {
      return res.status(400).json({ errors: [`Invalid status value: ${invalid.join(', ')}`] });
    }
    const found = await pets().then((c) => c
      .find({ status: { $in: requested } }, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray());
    res.json(found);
  } catch (err) {
    next(err);
  }
});

// GET /pets/findByTags?tags=tag1,tag2
router.get('/findByTags', async (req, res, next) => {
  try {
    const raw = req.query.tags;
    if (!raw) return res.status(400).json({ errors: ['tags query parameter is required'] });
    const names = String(raw).split(',').map((t) => t.trim()).filter(Boolean);
    if (names.length === 0) return res.status(400).json({ errors: ['tags query parameter is required'] });

    const found = await pets().then((c) => c
      .find({ 'tags.name': { $in: names } }, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray());
    res.json(found);
  } catch (err) {
    next(err);
  }
});

// GET /pets/:petId
router.get('/:petId', async (req, res, next) => {
  try {
    const id = parsePetId(req.params.petId);
    if (id === null) return res.status(400).json({ errors: ['Invalid ID supplied'] });

    const pet = await pets().then((c) => c.findOne({ id }, { projection: { _id: 0 } }));
    if (!pet) return res.status(404).json({ errors: ['Pet not found'] });
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

// POST /pets/:petId — update a pet with form data (name, status)
router.post('/:petId', async (req, res, next) => {
  try {
    const id = parsePetId(req.params.petId);
    if (id === null) return res.status(400).json({ errors: ['Invalid ID supplied'] });

    const { name, status } = req.body ?? {};
    const $set = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || name.length === 0) {
        return res.status(400).json({ errors: ['name must be a non-empty string'] });
      }
      $set.name = name;
    }
    if (status !== undefined) {
      if (!PET_STATUSES.includes(status)) {
        return res.status(400).json({ errors: [`Invalid status value: ${status}`] });
      }
      $set.status = status;
    }

    const updated = await pets().then((c) => c.findOneAndUpdate(
      { id },
      { $set },
      { returnDocument: 'after', projection: { _id: 0 } },
    ));
    if (!updated) return res.status(404).json({ errors: ['Pet not found'] });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /pets/:petId/uploadImage — accepts any body, reports metadata
router.post(
  '/:petId/uploadImage',
  express.raw({ type: () => true, limit: '5mb' }),
  async (req, res, next) => {
    try {
      const id = parsePetId(req.params.petId);
      if (id === null) return res.status(400).json({ errors: ['Invalid ID supplied'] });

      const exists = await pets().then((c) => c.findOne({ id }, { projection: { _id: 1 } }));
      if (!exists) return res.status(404).json({ errors: ['Pet not found'] });

      const bytes = Buffer.byteLength(req.body ?? Buffer.alloc(0));
      const ext = (req.headers['content-type']?.split('/')[-1] ?? 'bin').replace(/[^a-z0-9]/gi, '') || 'bin';
      res.status(201).json({
        code: 201,
        type: req.headers['content-type'] ?? 'application/octet-stream',
        message: `${bytes} bytes received for pet ${id}, saved as pet${id}.${ext}`,
      });
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /pets/:petId
router.delete('/:petId', async (req, res, next) => {
  try {
    const id = parsePetId(req.params.petId);
    if (id === null) return res.status(400).json({ errors: ['Invalid ID supplied'] });

    const deleted = await pets().then((c) => c.deleteOne({ id }));
    if (deleted.deletedCount === 0) return res.status(404).json({ errors: ['Pet not found'] });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
