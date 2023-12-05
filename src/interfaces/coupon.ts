import couponType from '@/constants/coupon';
import { User } from './user';

export type CouponType = (typeof couponType)[keyof typeof couponType];

export interface Coupon {
  _id: string;
  id: string;
  name: string;
  type: CouponType;
  startDate: string;
  endDate: string;
  discount: number;
  isActive: boolean;
  requiredCartTotal?: number;
  usageAmount: number;
  userIds: (string | User)[];
  maximumDiscount?: number;
  code: string;
  message: string;
  appliedProducts: string[];
  totalUsage: number;
}

export type NewCoupon = Omit<Coupon, '_id' | 'id' | 'totalUsage'>;

export type AppliedCoupon = Omit<
  Coupon,
  'startDate' | 'endDate' | 'isActive' | 'usageAmount' | 'userIds' | 'message' | 'totalUsage'
  | 'maximumDiscount' | 'requiredCartTotal'
> & { requiredCartTotal: number; maximumDiscount: number };
