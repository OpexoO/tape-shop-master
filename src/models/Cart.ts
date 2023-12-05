import { NewServerCart } from '@/interfaces/cart';
import { Schema, model, models } from 'mongoose';
import { ShippingDestination } from '@/interfaces/shippingRates';
import Product from './Product';
import { CouponSchema } from './Coupon';

const destinationSchema = new Schema<ShippingDestination>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  post_code: { type: String, required: true },
  country_code: { type: String, required: true },
  suburb: String,
  state: String,
}, { _id: false });

const itemSchema = new Schema({
  total: { type: Number, required: true },
  info: { type: Schema.Types.ObjectId, ref: Product, required: true },
  selectedOption: String,
}, { _id: false });

const CartSchema = new Schema<NewServerCart>({
  totalAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  appliedCouponPrice: { type: Number, default: 0 },
  items: [{ type: itemSchema, default: [] }],
  userId: { type: String, required: true },
  coupon: { type: CouponSchema, default: null },
  shippingDestination: { type: destinationSchema, default: null },
  lastUpdated: Date,
  expiryDate: { type: Date, expires: 0 },
});

const Cart = models.Cart || model('Cart', CartSchema);
export default Cart;
