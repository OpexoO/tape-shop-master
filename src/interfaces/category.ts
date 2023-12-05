export interface Category {
  _id: string;
  id: string;
  name: string;
  imageUrl: string;
}

export type NewCategory = Omit<Category, '_id' | 'id'>;
