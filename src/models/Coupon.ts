import { Coupon as ICoupon } from '@/interfaces/coupon';
import { Schema, model, models } from 'mongoose';
import User from './User';

export const CouponSchema = new Schema<ICoupon>({
  type: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  discount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  requiredCartTotal: Number,
  usageAmount: { type: Number, default: 1 },
  userIds: [{ type: Schema.Types.ObjectId, ref: User }],
  maximumDiscount: Number,
  code: { type: String, required: true },
  message: { type: String, required: true },
  appliedProducts: [{ type: Schema.Types.ObjectId }],
  totalUsage: { type: Number, default: 0 },
  name: { type: String, required: true },
});

const Coupon = models.Coupon || model('Coupon', CouponSchema);
export default Coupon;
