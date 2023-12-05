import { isValidString } from '@/utils/validTypes';
import { ShippingError } from './shippingError';

export interface ShippingRatesRequest {
  destination: ShippingDestination;
  packages: ShippingPackage[];
  currency?: string;
}

export interface ShippingRatesResponse {
  rates: ShippingRate[];
  success: boolean;
  errors: ShippingError[];
}

export interface ShippingDestination {
  street: string;
  city: string;
  post_code: string;
  country_code: string;
  suburb?: string;
  state?: string;
}

export interface ShippingPackage {
  weight: number;
  height?: number;
  width?: number;
  length?: number;
}

export interface ShippingRate {
  service_name: string;
  service_code: string;
  total_price: number;
}

export function isShippingDestination(obj: any): obj is ShippingDestination {
  const typed = obj as ShippingDestination;
  return isValidString(typed.street) && isValidString(typed.city)
    && isValidString(typed.post_code) && isValidString(typed.country_code)
    && (typed.suburb ? typeof typed.suburb === 'string' : true)
    && (typed.state ? typeof typed.state === 'string' : true);
}
