export const ORDER_STATUSES = [
  'placed',
  'approved',
  'delivered',
];

export function parseOrder(body = {}) {
  const errors = [];
  const order = {
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
  };

  if (!Number.isInteger(body.petId)) {
    errors.push('petId is required and must be an integer');
  } else {
    order.petId = body.petId;
  }

  if (body.quantity !== undefined) {
    if (!Number.isInteger(body.quantity) || body.quantity < 1) {
      errors.push('quantity must be a positive integer');
    } else {
      order.quantity = body.quantity;
    }
  }

  if (body.shipDate !== undefined) {
    if (typeof body.shipDate !== 'string' || Number.isNaN(Date.parse(body.shipDate))) {
      errors.push('shipDate must be an ISO-8601 date string');
    } else {
      order.shipDate = new Date(body.shipDate).toISOString();
    }
  }

  if (body.status !== undefined) {
    if (!ORDER_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${ORDER_STATUSES.join(', ')}`);
    } else {
      order.status = body.status;
    }
  }

  if (body.complete !== undefined) {
    if (typeof body.complete !== 'boolean') {
      errors.push('complete must be a boolean');
    } else {
      order.complete = body.complete;
    }
  }

  return { order, errors };
}
