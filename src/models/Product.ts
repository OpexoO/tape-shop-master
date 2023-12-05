import { ProductItem } from '@/interfaces/product/product';
import { Schema, model, models } from 'mongoose';
import Category from './Category';
import Type from './Type';

const ProductSchema = new Schema<ProductItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  rate: { type: Number, default: 0 },
  dateAdded: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: Category }],
  productType: [{ type: Schema.Types.ObjectId, ref: Type }],
  availability: Number,
  sku: { type: String, required: true },
  description: { type: String, required: true },
  images: Array,
  related: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  features: {
    image: String,
    features: { type: Array },
  },
  demo: {
    video: String,
    description: String,
  },
  characteristics: {
    phrase: String,
    items: [{ type: String }],
  },
  additionalInformation: [{
    caption: String,
    value: String,
    _id: false,
  }],
  options: [{
    width: String,
    role: String,
    price: Number,
    _id: false,
  }],
});

const Product = models.Product || model('Product', ProductSchema);
export default Product;
