import { Mongoose } from 'mongoose';

export interface DbConnection {
  connect: Mongoose | null,
  promise: Promise<Mongoose> | null,
}
