import { isValidString } from '@/utils/validTypes';

export interface ProductItemCharacteristics {
  phrase?: string;
  items: string[];
}

export function isProductItemCharacteristics(obj: any): obj is ProductItemCharacteristics {
  return (obj.phrase ? isValidString(obj.phrase) : true)
    && !!obj.items?.length
    && obj.items.every(isValidString);
}
