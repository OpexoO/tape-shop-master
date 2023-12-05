import { PreparedOrder, PreparedOrderItem } from '@/interfaces/order';
import { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema<PreparedOrderItem>({
  info: String,
  total: Number,
}, { _id: false });

const OrderSchema = new Schema<PreparedOrder>({
  orderId: { type: String, required: true },
  items: [{ type: OrderItemSchema, default: [] }],
  userId: { type: String, required: true },
  total: { type: Number, required: true },
  date: { type: String, required: true },
  trackingUrl: { type: String, required: true },
  trackingNumber: String,
  status: String,
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;
