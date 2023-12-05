import { Type as IType } from '@/interfaces/type';
import { Schema, model, models } from 'mongoose';
import Category from './Category';

const TypeSchema = new Schema<IType>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: Category }],
});

const Type = models.Type || model('Type', TypeSchema);
export default Type;
