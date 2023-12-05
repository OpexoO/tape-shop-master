import { Category as ICategory } from '@/interfaces/category';
import { Schema, model, models } from 'mongoose';

export const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Category = models.Category || model('Category', CategorySchema);
export default Category;
