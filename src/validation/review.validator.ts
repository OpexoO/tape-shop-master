import { PreparedReview } from '@/interfaces/review';
import { isValidEmail, isValidNumber, isValidString } from '@/utils/validTypes';
import { isValidObjectId } from 'mongoose';

export default class ReviewValidator {
  private readonly body: PreparedReview;

  constructor(body: PreparedReview) {
    this.body = body || {};
  }

  public isAllValid(): boolean | string {
    const allValidations = [
      this.isValidId, this.isValidRating,
      this.isValidMessage, this.isValidName, this.isValidEmail,
    ];
    for (let i = 0; i < allValidations.length; i += 1) {
      const result = allValidations[i].call(this);
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public isValidId(productId?: string): boolean | string {
    const value = productId || this.body.productId;
    if (!isValidObjectId(value)) {
      return 'Provide valid product ID';
    }
    return true;
  }

  public isValidRating(rating?: number): boolean | string {
    const value = +(rating || this.body.rating);
    if (!isValidNumber(value)) {
      return 'Rating is required and should be number';
    }
    return true;
  }

  public isValidMessage(text?: string): boolean | string {
    const value = text || this.body.text;
    if (!isValidString(value)) {
      return 'Text required and should be string';
    }
    return true;
  }

  public isValidName(name?: string): boolean | string {
    const value = name || this.body.name;
    if (!isValidString(value)) {
      return 'Name is required and should be string';
    }
    return true;
  }

  public isValidEmail(email?: string): boolean | string {
    const value = email || this.body.email;
    if (!isValidEmail(value)) {
      return 'Email is required and should be valid';
    }
    return true;
  }
}
