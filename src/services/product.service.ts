import {
  NewProductItem, PreparedProductItem, Product as IProduct, ProductItem, ProductItemPreview,
} from '@/interfaces/product/product';
import Product from '@/models/Product';
import ProductValidator from '@/validation/product.validator';
import { Types } from 'mongoose';
import CategoryService from './category.service';
import TypeService from './type.service';

export default class ProductService {
  public static validate(body: any): string | boolean {
    const validator = new ProductValidator(body);
    return validator.isAllValid();
  }

  public static prepareFields(fields: any): PreparedProductItem {
    const obj: PreparedProductItem = {
      name: fields.name as string,
      price: +fields.price,
      categories: fields.categories,
      productType: fields.productType,
      sku: fields.sku as string,
      description: fields.description as string,
      characteristics: fields.characteristics,
      images: fields.images,
      weight: fields.weight,
    };
    if (fields.related) {
      obj.related = fields.related;
    }
    if (![null, undefined].includes(fields.availability)) {
      obj.availability = +fields.availability;
    }
    if (fields.features) {
      obj.features = fields.features;
    }
    if (fields.demo) {
      obj.demo = fields.demo;
    }
    if (fields.additionalInformation) {
      obj.additionalInformation = fields.additionalInformation;
    }
    if (fields.options) {
      obj.options = fields.options;
    }
    return obj;
  }

  public static async preparePatchedFields(fields: any): Promise<Partial<ProductItem> | string> {
    const validator = new ProductValidator({});
    const obj: Partial<ProductItem> = {};

    if (fields.name) {
      const result = validator.isValidName(fields.name as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.name = fields.name as string;
    }
    if (fields.weight) {
      const result = validator.isValidWeight(+fields.weight);
      if (typeof result === 'string') {
        return result;
      }
      obj.weight = +fields.weight;
    }
    if (fields.price) {
      const result = validator.isValidPrice(+fields.price);
      if (typeof result === 'string') {
        return result;
      }
      obj.price = +fields.price;
    }
    if (fields.categories) {
      const categories = fields.categories as string[];
      const result = validator.isValidCategories(categories);
      if (typeof result === 'string') {
        return result;
      }
      obj.categories = categories;
    }
    if (fields.productType) {
      const productType = fields.productType as string[];
      const result = validator.isValidproductType(productType);
      if (typeof result === 'string') {
        return result;
      }
      obj.productType = productType;
    }
    if (fields.related) {
      const related = fields.related as string[];
      const result = validator.isValidRelatedProducts(related);
      if (typeof result === 'string') {
        return result;
      }
      obj.related = related;
    }
    if (fields.sku) {
      const result = validator.isValidSku(fields.sku as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.sku = fields.sku as string;
    }
    if (fields.description) {
      const result = validator.isValidDescription(fields.description as string);
      if (typeof result === 'string') {
        return result;
      }
      obj.description = fields.description as string;
    }
    if (fields.characteristics) {
      const { characteristics } = fields;
      const result = validator.isValidCharacteristics(characteristics);
      if (typeof result === 'string') {
        return result;
      }
      obj.characteristics = characteristics;
    }
    if (fields.features) {
      const { features } = fields;
      const result = validator.isValidFeatures(features);
      if (typeof result === 'string') {
        return result;
      }
      obj.features = features;
    }
    if (fields.demo) {
      const { demo } = fields;
      const result = validator.isValidDemo(demo);
      if (typeof result === 'string') {
        return result;
      }
      obj.demo = demo;
    }
    if (fields.additionalInformation) {
      const { additionalInformation } = fields;
      const result = validator.isValidAdditionalInfo(additionalInformation);
      if (typeof result === 'string') {
        return result;
      }
      obj.additionalInformation = additionalInformation;
    }
    if (fields.options) {
      const { options } = fields;
      const result = validator.isValidOptions(options);
      if (typeof result === 'string') {
        return result;
      }
      obj.options = options;
    }
    if (![null, undefined].includes(fields.availability)) {
      const result = validator.isValidAvailability(+fields.availability);
      if (typeof result === 'string') {
        return result;
      }
      obj.availability = +fields.availability;
    } else {
      obj.availability = null;
    }
    if (fields.images?.length) {
      const { images } = fields;
      const result = validator.isValidImages(images);
      if (typeof result === 'string') {
        return result;
      }
      obj.images = images;
    }

    return obj;
  }

  public static toServer(fields: PreparedProductItem): NewProductItem {
    return ({
      ...fields,
      dateAdded: new Date().toISOString(),
      categories: fields.categories!.map((id: string) => new Types.ObjectId(id)),
      productType: [new Types.ObjectId(fields.productType[0])],
      related: (fields.related || []).map((id: string) => new Types.ObjectId(id)),
    });
  }

  public static fromServer(item: any | any[]): ProductItem | ProductItem[] {
    const mapObject = (o: any) => ({
      _id: o._id,
      id: o._id.toString(),
      name: o.name,
      price: o.price,
      rate: Math.round(o.rate || 0),
      dateAdded: o.dateAdded,
      sku: o.sku,
      description: o.description,
      images: o.images,
      characteristics: o.characteristics,
      availability: o.availability,
      features: o.features,
      demo: o.demo,
      options: o.options,
      weight: o.weight,
      additionalInformation: o.additionalInformation,
      categories: o.categories.map((id: Types.ObjectId) => id.toString()),
      productType: o.productType.map((id: Types.ObjectId) => id.toString()),
      related: (o.related || []).map((id: Types.ObjectId) => id.toString()),
    });

    if (Array.isArray(item)) {
      return item.map(mapObject);
    }

    return mapObject(item);
  }

  public static toFullProduct(product: any): IProduct | IProduct[] {
    const mapObject = (o: any) => ({
      _id: o._id,
      id: o._id.toString(),
      name: o.name,
      price: o.price,
      rate: Math.round(o.rate || 0),
      dateAdded: o.dateAdded,
      sku: o.sku,
      description: o.description,
      images: o.images,
      characteristics: o.characteristics,
      availability: o.availability,
      features: o.features,
      demo: o.demo,
      weight: o.weight,
      additionalInformation: o.additionalInformation,
      options: o.options,
      categories: o.categories.map(CategoryService.fromServer),
      productType: o.productType.map(TypeService.fromServer),
      related: (o.related || []).map((id: Types.ObjectId) => id.toString()),
    });

    if (Array.isArray(product)) {
      return product.map(mapObject);
    }
    return mapObject(product);
  }

  public static toPreview(products: IProduct | IProduct[]): ProductItemPreview | ProductItemPreview[] {
    const mapObject = (o: IProduct): ProductItemPreview => ({
      _id: o._id.toString(),
      id: o._id.toString(),
      name: o.name,
      rate: Math.round(o.rate || 0),
      images: o.images,
      price: o.price,
      categories: o.categories,
      dateAdded: o.dateAdded,
      availability: o.availability,
      weight: o.weight,
      withOptions: !!o.options?.length,
    });

    if (Array.isArray(products)) {
      return products.map(mapObject);
    }
    return mapObject(products);
  }

  public static toPartialPreview(product: IProduct): Partial<ProductItemPreview> {
    return ({
      _id: product._id.toString(),
      id: product._id.toString(),
      name: product.name,
      price: product.price,
    });
  }

  public static getByTypeCategories(typeId: string, categoryId: string) {
    return Product
      .find({
        productType: new Types.ObjectId(typeId),
        categories: new Types.ObjectId(categoryId),
      });
  }

  public static getByCategoryId(id: string) {
    return Product
      .find({ categories: new Types.ObjectId(id) })
      .populate(['categories', 'productType'])
      .exec();
  }

  public static getByTypeId(id: string) {
    return Product
      .find({ productType: new Types.ObjectId(id) })
      .populate(['categories', 'productType'])
      .exec();
  }

  public static getById(id: string) {
    return Product
      .findOne({ _id: new Types.ObjectId(id) })
      .populate(['categories', 'productType'])
      .exec();
  }

  public static getAll() {
    return Product.find({}).populate(['categories', 'productType']).exec();
  }
}
