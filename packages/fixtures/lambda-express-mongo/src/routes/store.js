import { Router } from 'express';

import { orders, pets, nextId } from '../mongo.js';
import { parseOrder } from '../models/order.js';

const router = Router();

function parseOrderId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id >= 1 && id <= 10 ? id : null;
}

// GET /store/inventory — counts per status
router.get('/inventory', async (_req, res, next) => {
  try {
    const rows = await pets().then((c) => c.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray());
    const inventory = Object.fromEntries(rows.map((r) => [r._id, r.count]));
    res.json(inventory);
  } catch (err) {
    next(err);
  }
});

// POST /store/order — place an order for a pet
router.post('/order', async (req, res, next) => {
  try {
    const { order, errors } = parseOrder(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const pet = await pets().then((c) => c.findOne({ id: order.petId }, { projection: { _id: 1, status: 1 } }));
    if (!pet) return res.status(404).json({ errors: ['Pet not found'] });
    if (pet.status !== 'available') {
      return res.status(409).json({ errors: [`Pet ${order.petId} is ${pet.status}, not available`] });
    }

    const doc = { ...order, id: await nextId('order') };
    await orders().then((c) => c.insertOne(doc));
    const { _id, ...publicOrder } = doc;
    res.status(201).json(publicOrder);
  } catch (err) {
    next(err);
  }
});

// GET /store/order/:orderId (valid ids are 1..10, per the spec)
router.get('/order/:orderId', async (req, res, next) => {
  try {
    const id = parseOrderId(req.params.orderId);
    if (id === null) return res.status(400).json({ errors: ['Invalid ID supplied'] });

    const order = await orders().then((c) => c.findOne({ id }, { projection: { _id: 0 } }));
    if (!order) return res.status(404).json({ errors: ['Order not found'] });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// DELETE /store/order/:orderId
router.delete('/order/:orderId', async (req, res, next) => {
  try {
    const id = parseOrderId(req.params.orderId);
    if (id === null) return res.status(400).json({ errors: ['Invalid ID supplied'] });

    const deleted = await orders().then((c) => c.deleteOne({ id }));
    if (deleted.deletedCount === 0) return res.status(404).json({ errors: ['Order not found'] });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
