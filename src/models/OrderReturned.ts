import { ReturnedOrder } from '@/interfaces/order';
import { Schema, model, models } from 'mongoose';
import User from './User';

const OrderReturnedSchema = new Schema<ReturnedOrder>({
  orderId: { type: String, required: true },
  user: { type: String, ref: User },
  reason: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, default: new Date().toISOString() },
  status: String,
});

const OrderReturned = models.OrderReturned || model('OrderReturned', OrderReturnedSchema);
export default OrderReturned;
