import { Types } from 'mongoose';

export interface ContactFeedback {
  name: string;
  email: string;
  message: string;
  reviewed: boolean;
  date: string;
  _id: string;
  id: string;
}

export type NewContactFeedback = Omit<ContactFeedback, '_id' | 'id'>
export type ServerContactFeedback = Omit<ContactFeedback, '_id' | 'id'> & { _id: Types.ObjectId }
export type PreparedContactFeedback = Omit<ContactFeedback, '_id' | 'id' | 'date' | 'reviewed'>
