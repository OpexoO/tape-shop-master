import { isValidImage, isValidObject } from '@/utils/validTypes';

export interface ProductItemFeatures {
  image?: string;
  features?: Record<string, string>[];
}

export function isProductItemFeatures(obj: any): obj is ProductItemFeatures {
  return Array.isArray(obj?.features)
    && (obj?.features.length
      ? obj.features.every(isValidObject)
      : true) && (obj.image ? isValidImage(obj.image) : true);
}
