import { isValidString } from '@/utils/validTypes';

export interface ProductItemDemo {
  video: string;
  description: string;
}

export function isProductItemDemo(obj: any): obj is ProductItemDemo {
  if (obj?.video && !isValidString(obj?.video)) {
    return false;
  }
  if (obj?.description && !isValidString(obj?.description)) {
    return false;
  }
  return true;
}
