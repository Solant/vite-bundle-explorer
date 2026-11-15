import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB ?? 'petstore';

const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});

let dbPromise = null;

export function getDb() {
  dbPromise ||= client
    .connect()
    .then(() => client.db(dbName))
    .then(async (db) => {
      await Promise.all([
        db.collection('pets').createIndex({ id: 1 }, { unique: true }),
        db.collection('users').createIndex({ username: 1 }, { unique: true }),
        db.collection('orders').createIndex({ id: 1 }, { unique: true }),
      ]);
      return db;
    });
  return dbPromise;
}

export function pets() {
  return getDb().then((db) => db.collection('pets'));
}

export function orders() {
  return getDb().then((db) => db.collection('orders'));
}

export function users() {
  return getDb().then((db) => db.collection('users'));
}

// Auto-increment integer ids, matching the petstore's id scheme
export async function nextId(counter) {
  const db = await getDb();
  const doc = await db.collection('counters').findOneAndUpdate(
    { _id: counter },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  return doc.seq;
}

export async function closeDb() {
  if (dbPromise) {
    await client.close();
    dbPromise = null;
  }
}
