import { Types } from 'mongoose';
import { Category } from './category';

export interface Type {
  _id: string;
  id: string;
  name: string;
  categories: Category[];
}

export interface NewType {
  _id: Types.ObjectId;
  id: string;
  name: string;
  categories?: Types.ObjectId[];
}
