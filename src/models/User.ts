import { FullUser } from '@/interfaces/user';
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema<FullUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    default: '',
  },
  hashExp: {
    type: String,
    default: '',
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  appliedCoupons: [{
    id: String,
    amount: Number,
  }],
});

const User = models.User || model('User', UserSchema);
export default User;
