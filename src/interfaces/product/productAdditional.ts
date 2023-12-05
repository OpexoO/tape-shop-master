import { isValidString } from '@/utils/validTypes';

export interface ProductItemAdditional {
  caption: string;
  value: string,
}

export function isProductItemAdditional(obj: any): obj is ProductItemAdditional {
  return isValidString(obj.caption) && isValidString(obj.value);
}
