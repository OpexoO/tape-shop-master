/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import { DbConnection } from '@/interfaces/db';
import { connect } from 'mongoose';

declare global {
  namespace globalThis {
    var mongoose: DbConnection;
  }
}

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  const obj: DbConnection = { connect: null, promise: null };
  cached = obj;
  global.mongoose = obj;
}

export default async function dbConnect() {
  if (cached.connect) {
    return cached.connect;
  }

  if (!cached.promise) {
    cached.promise = connect(MONGO_URI!);
  }

  cached.connect = await cached.promise;
  return cached.connect;
}
