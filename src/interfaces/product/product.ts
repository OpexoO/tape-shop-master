import { Types } from 'mongoose';
import { ProductItemAdditional } from './productAdditional';
import { ProductItemCharacteristics } from './productCharacteristics';
import { ProductItemDemo } from './productDemo';
import { ProductItemFeatures } from './productFeatures';
import { Category } from '../category';
import { Type } from '../type';
import { ProductOption } from './productOption';

export interface ProductItem {
  _id: string;
  id: string;
  name: string;
  price: number;
  rate: number;
  dateAdded: string;
  categories: string[];
  productType: string[];
  sku: string;
  weight: number;
  description: string;
  images: string[];
  characteristics: ProductItemCharacteristics;
  availability?: number | null;
  related?: string[];
  features?: ProductItemFeatures;
  demo?: ProductItemDemo;
  additionalInformation?: ProductItemAdditional[];
  options?: ProductOption[];
}

export type Product = Omit<
  ProductItem,
  'categories' | 'productType' | 'related'
> & { categories: Category[], productType: Type[], related: string[] }

export type NewProductItem = Omit<
  ProductItem,
  '_id' | 'id' | 'categories' | 'productType' | 'related' | 'rate'
> & { categories: Types.ObjectId[], related: Types.ObjectId[], productType: Types.ObjectId[] }

export type PreparedProductItem = Omit<ProductItem, '_id' | 'id' | 'rate' | 'dateAdded' | 'rate'>

export type ProductItemPreview = Pick<
  Product,
  '_id' | 'id' | 'name' | 'rate' | 'price' | 'images' | 'categories' | 'dateAdded' | 'availability' | 'weight'
> & { withOptions: boolean, selectedOption?: string };
