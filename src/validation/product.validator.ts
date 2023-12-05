import { isProductItemAdditional } from '@/interfaces/product/productAdditional';
import { isProductItemCharacteristics } from '@/interfaces/product/productCharacteristics';
import { isProductItemDemo } from '@/interfaces/product/productDemo';
import { isProductItemFeatures } from '@/interfaces/product/productFeatures';
import { isValidOption } from '@/interfaces/product/productOption';
import { isValidImage, isValidNumber, isValidString } from '@/utils/validTypes';
import { isValidObjectId } from 'mongoose';

export default class ProductValidator {
  private readonly body: any;

  constructor(body: any = {}) {
    this.body = body;
  }

  public isAllValid(): boolean | string {
    const allValidations = [
      this.isValidFeatures, this.isValidDemo, this.isValidAdditionalInfo, this.isValidAvailability,
      this.isValidCharacteristics, this.isValidRelatedProducts, this.isValidImages, this.isValidDescription,
      this.isValidSku, this.isValidproductType, this.isValidCategories, this.isValidPrice, this.isValidName,
      this.isValidWeight, this.isValidOptions,
    ];
    for (let i = 0; i < allValidations.length; i += 1) {
      const result = allValidations[i].call(this);
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public isValidName(name?: string): boolean | string {
    if (!isValidString(name || this.body.name)) {
      return 'Name is required string field';
    }
    return true;
  }

  public isValidSku(sku?: string): boolean | string {
    if (!isValidString(sku || this.body.sku)) {
      return 'SKU is required string field';
    }
    return true;
  }

  public isValidDescription(description?: string): boolean | string {
    if (!isValidString(description || this.body.description)) {
      return 'Description is required string field';
    }
    return true;
  }

  public isValidPrice(price?: number): boolean | string {
    if (!isValidNumber(price || this.body.price) || +(price || this.body.price) <= 0) {
      return 'Price is required number field';
    }
    return true;
  }

  public isValidWeight(weight?: number): boolean | string {
    if (!isValidNumber(weight || this.body.weight) || +(weight || this.body.weight) <= 0) {
      return 'Weight is required positive number';
    }
    return true;
  }

  public isValidCategories(categories?: string[]): boolean | string {
    if (!Array.isArray(categories || this.body.categories)
      || !(categories || this.body.categories).every(isValidObjectId)) {
      return 'Product categories should be array of ID\'s';
    }
    return true;
  }

  public isValidRelatedProducts(related?: string[]): boolean | string {
    if ((related || this.body.related)
      && (!Array.isArray(related || this.body.related)
        || !(related || this.body.related).every(isValidObjectId))) {
      return 'Related products should be array of ID\'s';
    }
    return true;
  }

  public isValidproductType(productType?: string[]): boolean | string {
    if (!isValidObjectId((productType && productType[0]) || this.body.productType[0])) {
      return 'Product type should be valid ID';
    }
    return true;
  }

  public isValidAvailability(availability?: number): boolean | string {
    if ((availability || this.body.availability) && !isValidNumber(availability || this.body.availability)) {
      return 'Availability should be number';
    }
    return true;
  }

  public isValidCharacteristics(characteristics?: any): boolean | string {
    if ((characteristics || this.body.characteristics)
      && !isProductItemCharacteristics(characteristics || this.body.characteristics)) {
      return 'Provide valid characteristics';
    }
    return true;
  }

  public isValidAdditionalInfo(additionalInformation?: any): boolean | string {
    if (
      (additionalInformation || this.body.additionalInformation)
      && (!Array.isArray(additionalInformation || this.body.additionalInformation)
        || !(additionalInformation || this.body.additionalInformation).every(isProductItemAdditional))
    ) {
      return 'Provide valid additional information';
    }
    return true;
  }

  public isValidOptions(options?: any): boolean | string {
    const data = options || this.body.options;
    if (data?.length && (!Array.isArray(data) || !data.every(isValidOption))) {
      return 'Provide valid options';
    }
    return true;
  }

  public isValidDemo(demo?: any): boolean | string {
    if ((demo || this.body.demo) && !isProductItemDemo(demo || this.body.demo)) {
      return 'Provide valid demo';
    }
    return true;
  }

  public isValidFeatures(features?: any): boolean | string {
    if (
      ((features || this.body.features) && !isProductItemFeatures(features || this.body.features))
    ) {
      return 'Provide valid features';
    }
    return true;
  }

  public isValidImages(images?: string[]): boolean | string {
    if (
      !Array.isArray(images || this.body.images)
      || !(images || this.body.images || []).every(isValidImage)
    ) {
      return 'Images are required and should be array of images';
    }
    return true;
  }
}
