/* eslint-disable no-unused-vars */
import { isValidObjectId } from 'mongoose';
import { isValidNumber } from '@/utils/validTypes';
import { CartActionsType } from '@/constants/cartActions';
import { AppliedCoupon } from './coupon';
import { ProductItemPreview } from './product/product';
import { ShippingDestination, ShippingRate } from './shippingRates';

export interface CartContextProps {
  cart: Cart;
  setLoading: (isLoading: boolean) => void;
  addItems: (items: ProductItemPreview | CartItem) => Promise<boolean>;
  removeItems: (item: ProductItemPreview, deleteAll?: boolean) => Promise<boolean>;
  applyCoupon: (coupon: AppliedCoupon | null) => Promise<string | boolean>;
  applyShipping: (
    items: CartItem[], destination: ShippingDestination | null
  ) => Promise<ShippingRate[] | null>;
  getSessionCart: (toCreate?: boolean) => void;
  resetCart: () => void;
  deleteCartFromDb: (session: string) => Promise<void>;
  saveCartToMerge: () => void;
}

export interface Cart {
  _id: string;
  id: string;
  userId: string;
  coupon?: AppliedCoupon | null;
  appliedCouponPrice?: number;
  shippingDestination: ShippingDestination | null;
  totalAmount: number;
  totalPrice: number;
  items: CartItem[];
  lastUpdated?: Date;
}

export interface CartItem {
  info: ProductItemPreview;
  total: number;
}

export interface ServerCartItem {
  info: string;
  total: number;
  selectedOption?: string;
}

export interface CartActionRequest {
  item?: ServerCartItem;
  coupon: AppliedCoupon | null;
  shippingDestination: ShippingDestination | null;
  action: CartActionsType;
}

export type NewServerCart = Omit<Cart, '_id' | 'id' | 'items'> & {
  items: ServerCartItem[];
  expiryDate: Date;
};

export function isCartItem(item: any): item is CartItem {
  const typed = item as CartItem;
  return typed.info !== null && typeof typed.info === 'object' && typeof typed.total === 'number';
}

export function isServerCartItem(item: any): item is ServerCartItem {
  const typed = item as ServerCartItem;
  return !!typed.info && isValidObjectId(typed.info) && isValidNumber(typed.total) && typed.total >= 0;
}
