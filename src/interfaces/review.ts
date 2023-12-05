import { Types } from 'mongoose';

export interface Review {
  _id: string;
  id: string;
  productId: string;
  rating: number;
  text: string;
  name: string;
  date: string;
  isApproved: boolean;
  isChecked: boolean;
}

export type FullReview = Review & { email: string };

export type PreparedReview = Omit<Review, '_id' | 'id' | 'date'> & { email: string };

export type NewReview = Omit<PreparedReview, 'productId'> & {
  date: string;
  productId: Types.ObjectId,
}
