export const PET_STATUSES = [
  'available',
  'pending',
  'sold',
];

export function parsePet(body = {}) {
  const errors = [];
  const pet = {};

  if (body.id !== undefined) {
    if (!Number.isInteger(body.id) || body.id < 0) {
      errors.push('id must be a non-negative integer');
    } else {
      pet.id = body.id;
    }
  }

  if (typeof body.name !== 'string' || body.name.length === 0) {
    errors.push('name is required and must be a non-empty string');
  } else {
    pet.name = body.name;
  }

  if (!Array.isArray(body.photoUrls) || body.photoUrls.some((u) => typeof u !== 'string')) {
    errors.push('photoUrls is required and must be an array of strings');
  } else {
    pet.photoUrls = body.photoUrls;
  }

  if (body.category !== undefined) {
    if (typeof body.category !== 'object' || body.category === null) {
      errors.push('category must be an object');
    } else {
      pet.category = {
        id: Number.isInteger(body.category.id) ? body.category.id : 0,
        name: typeof body.category.name === 'string' ? body.category.name : '',
      };
    }
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      errors.push('tags must be an array');
    } else {
      pet.tags = body.tags.map((t) => ({
        id: Number.isInteger(t?.id) ? t.id : 0,
        name: typeof t?.name === 'string' ? t.name : '',
      }));
    }
  }

  if (body.status !== undefined) {
    if (!PET_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${PET_STATUSES.join(', ')}`);
    } else {
      pet.status = body.status;
    }
  }

  return { pet, errors };
}
