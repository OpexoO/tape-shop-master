import { Review as IReview, PreparedReview } from '@/interfaces/review';
import { Schema, Types, model, models } from 'mongoose';

const ReviewSchema = new Schema<PreparedReview & IReview>({
  productId: Types.ObjectId,
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, default: new Date().toISOString },
  isApproved: { type: Boolean, default: false },
  isChecked: { type: Boolean, default: false },
});

const Review = models.Review || model('Review', ReviewSchema);
export default Review;
