const STRING_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'password',
  'phone',
];

export function parseUser(body = {}, { partial = false } = {}) {
  const errors = [];
  const user = {};

  if (body.id !== undefined) {
    if (!Number.isInteger(body.id) || body.id < 0) {
      errors.push('id must be a non-negative integer');
    } else {
      user.id = body.id;
    }
  }

  if (body.username !== undefined) {
    if (typeof body.username !== 'string' || body.username.length === 0) {
      errors.push('username must be a non-empty string');
    } else {
      user.username = body.username;
    }
  } else if (!partial) {
    errors.push('username is required');
  }

  for (const field of STRING_FIELDS) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'string') {
      errors.push(`${field} must be a string`);
    } else {
      user[field] = body[field];
    }
  }

  if (body.userStatus !== undefined) {
    if (!Number.isInteger(body.userStatus)) {
      errors.push('userStatus must be an integer');
    } else {
      user.userStatus = body.userStatus;
    }
  }

  return { user, errors };
}
